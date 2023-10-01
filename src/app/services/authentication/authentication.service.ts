import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { userData } from 'src/app/models/UserData';
import { loginRequestModel } from 'src/app/models/LoginRequestModel';
import { CookieService } from 'ngx-cookie-service';
import { CookieNames } from '../cookieNames';
import { registerRequestModel } from 'src/app/models/RegisterRequestModel';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl: string = environment.apiURL;
  private authToken: string | null = null;
  private userData: userData | null = null;
  private isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient,
    private cookieNames: CookieNames,
    private cookieService: CookieService
  ) {}

  // Setter methods for storing data
  setAuthToken(token: string) {
    this.authToken = token;
    this.cookieService.set(this.cookieNames.authenticationToken, token);
  }

  setUserData(user: userData) {
    this.userData = user;
  }

  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  // Getter methods
  public getAuthToken(): string | null {
    return this.authToken !== null
      ? this.authToken
      : this.cookieService.get(this.cookieNames.authenticationToken);
  }

  public getUserData(): userData | null {
    return this.userData;
  }

  public isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  // api calls
  public userProfileAPI<T>(): Observable<T> {
    const getUserProfileUrl = `${this.apiUrl}/user-profile`;
    return this.http.get(getUserProfileUrl, {}) as Observable<T>;
  }

  public loginAPI(formData: loginRequestModel): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`;
    return this.http.post(loginUrl, formData);
  }

  public logoutAPI(): Observable<any> {
    const logoutUrl = `${this.apiUrl}/logout`;
    return this.http.post(logoutUrl, {});
  }

  public refreshAPI(): Observable<any> {
    const refreshUrl = `${this.apiUrl}/refresh`;
    return this.http.post(refreshUrl, {});
  }

  public registerAPI(formdata: registerRequestModel): Observable<any> {
    const refreshUrl = `${this.apiUrl}/register`;
    return this.http.post(refreshUrl, formdata);
  }

  // normal auth functions
  public logout() {
    this.logoutAPI()
      .pipe(take(1))
      .subscribe(() => {
        this.authToken = null;
        this.userData = null;
        this.cookieService.delete(this.cookieNames.authenticationToken);
        this.isAuthenticated = false;
      });
  }

}
