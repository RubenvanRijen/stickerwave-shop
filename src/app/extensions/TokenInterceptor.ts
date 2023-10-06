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

  /**
   * intercept every http request and automatically give it an jwt token if possible
   * if not then try to retrieve a token if there was ever one or return the normal request without any token header.
   * @param req the request that is being send and intercepted.
   * @param next the httpHandler.
   * @returns 
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Get the JWT token from your AuthService or in the cookies
    const token: string | null = this.authenticationService.getAuthToken();

    if (token) {
      // if there is a token check if its not expired.
      const tokenPayload: string = token.split('.')[1];
      const decodedTokenPayload: any = JSON.parse(atob(tokenPayload));
      const currentTime: number = Math.floor(Date.now() / 1000); // Convert to seconds

      // If the token has nog expired then give the token to the previous call.
      if (decodedTokenPayload.exp && decodedTokenPayload.exp > currentTime) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Clone the request and add the Authorization header with the token
        return next.handle(cloned);
      } else {
        // if it's expired then refresh the token en give it to the api call made earlier.
        const newTokenData = this.authenticationService.refreshAPI();
        newTokenData.pipe(
          take(1),
          switchMap((newToken) => {
            // Retry the original request with the new token gotten from a refresh.
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            this.authenticationService.setAuthenticated(true);
            return next.handle(newReq);
          })
        );
      }
    }
    // return the normal call and let it handle the rest there.
    return next.handle(req.clone());
  }
}
