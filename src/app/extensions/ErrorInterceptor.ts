import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Attempt to refresh the token
          return this.authenticationService
            .refreshAPI(
              new HttpHeaders({
                Authorization: `Bearer ${this.authenticationService.getAuthToken()}`,
              })
            )
            .pipe(
              switchMap((newToken) => {
                console.log(newToken);
                // Retry the original request with the new token
                const newRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`,
                  },
                });
                return next.handle(newRequest);
              }),
              catchError((refreshError) => {
                // Token refresh failed, handle the error
                // You can log the user out or redirect to a login page
                return throwError(refreshError);
              })
            );
        }
        // Handle other types of errors here as needed.
        return throwError(error);
      })
    );
  }
}
