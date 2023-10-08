import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { switchMap, catchError, take, tap, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { CookieNames } from '../services/cookieNames';
import { RefreshResponseModel } from '../models/RefreshResponseModel';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private cookieNames: CookieNames
  ) {}
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authenticationService.getAuthToken()) {
      request = this.addToken(
        request,
        this.authenticationService.getAuthToken()
      );
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authenticationService.refreshAPI<RefreshResponseModel>().pipe(
        switchMap((response: RefreshResponseModel) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.access_token);
          return next.handle(this.addToken(request, response.access_token));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}
