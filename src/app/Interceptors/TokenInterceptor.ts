import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { switchMap, catchError, take, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { RefreshResponseModel } from '../models/RefreshResponseModel';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  // Flag to prevent multiple simultaneous token refresh attempts
  private isRefreshing = false;

  // Subject to manage token refresh
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  /**
   * Intercept HTTP requests
   * @param request
   * @param next
   * @returns
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if a valid authentication token exists and add it to the request
    if (this.authenticationService.getAuthToken()) {
      request = this.addToken(
        request,
        this.authenticationService.getAuthToken()
      );
    }

    // Continue with the request and handle errors
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Handle 401 (Unauthorized) error by attempting token refresh
          return this.handle401Error(request, next);
        } else {
          // Pass other errors through
          return throwError(error);
        }
      })
    );
  }

  /**
   * Add the authentication token to the request headers
   * @param request
   * @param token
   * @returns
   */
  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Handle 401 (Unauthorized) errors by attempting token refresh
   * @param request
   * @param next
   * @returns
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      // Set flag to prevent multiple simultaneous token refresh attempts
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // Attempt to refresh the token
      return this.authenticationService.refreshAPI<RefreshResponseModel>().pipe(
        switchMap((response: RefreshResponseModel) => {
          // Token refresh successful
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.access_token);
          this.authenticationService.setAuthToken(response.access_token);
          this.authenticationService.setAuthenticated(true);
          // Retry the original request with the new token
          return next.handle(this.addToken(request, response.access_token));
        }),
        catchError((error: any) => {
          // Handle the case where the refresh token fails.
          this.authenticationService.logout();
          return throwError(error);
        })
      );
    } else {
      // Wait for the token to be refreshed and then retry the request
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt: any) => {
          // Retry the original request with the new token
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}
