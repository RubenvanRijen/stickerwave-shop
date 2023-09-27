// Create an HTTP interceptor (e.g., token-interceptor.ts)

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { switchMap, catchError, take } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable() // Add the @Injectable decorator here
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Get the JWT token from your AuthService or wherever it's stored
    const token: string | null = this.authenticationService.getAuthToken();

    if (token) {
      const tokenPayload: string = token.split('.')[1];
      const decodedTokenPayload: any = JSON.parse(atob(tokenPayload));
      const currentTime: number = Math.floor(Date.now() / 1000); // Convert to seconds

      if (decodedTokenPayload.exp && decodedTokenPayload.exp > currentTime) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Clone the request and add the Authorization header with the token
        return next.handle(cloned);
      } else {
        const newTokenData = this.authenticationService.refreshAPI();
        newTokenData.pipe(
          take(1),
          switchMap((newToken) => {
            // Retry the original request with the new token
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next.handle(newReq);
          })
        );
      }
    }
    return next.handle(req.clone());
  }
}
