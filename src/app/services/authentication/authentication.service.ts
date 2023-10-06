import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { userData } from 'src/app/models/UserData';
import { loginRequestModel } from 'src/app/models/LoginRequestModel';
import { CookieService } from 'ngx-cookie-service';
import { CookieNames } from '../cookieNames';
import { registerRequestModel } from 'src/app/models/RegisterRequestModel';
import { Router } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl: string = environment.apiURL;
  private webUrl: string = environment.webURL;
  private authToken: string | null = null;
  private userData: userData | null = null;
  private isAuthenticated: boolean = false;

  constructor(
    private http: HttpClient,
    private cookieNames: CookieNames,
    private cookieService: CookieService,
    private router: Router,
    private location: Location,
    private platformLocation: PlatformLocation
  ) {}

  // SETTER METHODES

  /**
   * set the jwt token in the local storage of angular and the cookies
   * @param token the jwt token
   */
  setAuthToken(token: string) {
    this.authToken = token;
    this.cookieService.set(this.cookieNames.authenticationToken, token);
  }

  /**
   * set the user data
   * @param user the user data.
   */
  setUserData(user: userData) {
    this.userData = user;
  }

  /**
   * set if a user is logged in.
   * @param isAuthenticated boolean
   */
  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  // GETTER METHODES

  /**
   * returns the jwt token from the angular local storage or the coockies.
   * But it first tries the fastests method the local angular storage.
   * @returns
   */
  public getAuthToken(): string | null {
    return this.authToken !== null
      ? this.authToken
      : this.cookieService.get(this.cookieNames.authenticationToken);
  }

  /**
   * get the user data from the local angular storage
   * @returns
   */
  public getUserData(): userData | null {
    return this.userData;
  }

  /**
   * return if the user is logged in.
   * @returns
   */
  public isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  // API CALLS

  /**
   * user data call to the api
   * @returns user profile response in observarble
   */
  public userProfileAPI<T>(): Observable<T> {
    const getUserProfileUrl = `${this.apiUrl}/user-profile`;
    return this.http.get(getUserProfileUrl, {}) as Observable<T>;
  }

  /**
   * login call to the api
   * @param formData the data for request.
   * @returns login response in observarble
   */
  public loginAPI(formData: loginRequestModel): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`;
    return this.http.post(loginUrl, formData);
  }

  /**
   * logout call to the api
   * @returns logout response in observarble
   */
  public logoutAPI(): Observable<any> {
    const logoutUrl = `${this.apiUrl}/logout`;
    return this.http.post(logoutUrl, {});
  }

  /**
   * refresh token call to the api
   * @returns refresh response in observarble
   */
  public refreshAPI(): Observable<any> {
    const refreshUrl = `${this.apiUrl}/refresh`;
    return this.http.post(refreshUrl, {});
  }

  /**
   * register call to the api
   * @param formdata the data for the request
   * @returns register response in observarble
   */
  public registerAPI(formdata: registerRequestModel): Observable<any> {
    const refreshUrl = `${this.apiUrl}/register`;
    return this.http.post(refreshUrl, formdata);
  }

  /**
   * send email verification link call to the api
   * @param email the email where to send the email to.
   * @returns send email verification response in observarble
   */
  public sendEmailVerificationLinkAPI(email: string): Observable<any> {
    const sendEmailVerificationUrl = `${this.apiUrl}/send-verify-email`;
    const redirect_url: string = encodeURIComponent(this.getHomeUrl());
    return this.http.post(sendEmailVerificationUrl, { email, redirect_url });
  }

  // FUNCTIONS

  /**
   * logout the user and wipe all the data stored.
   */
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

  /**
   * get the home url of the website.
   * this has been made for the redirect link after the user has verified it's email.
   * @returns the url
   */
  private getHomeUrl(): string {
    const protocol: string = this.location.normalize(
      this.platformLocation.protocol
    );
    const hostname: string = this.platformLocation.hostname;
    const port: string = this.platformLocation.port;
    const baseHref: string = this.location.normalize('/login');
    return `${protocol}//${hostname}:${port}${baseHref}`;
  }
}
