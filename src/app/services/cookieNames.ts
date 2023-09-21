import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieNames {
  public authenticationToken: string = 'jwt_token';
}
