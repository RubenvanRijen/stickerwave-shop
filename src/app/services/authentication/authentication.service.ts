import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { userData } from 'src/app/models/UserData';
import { loginRequestModel } from 'src/app/models/LoginRequestModel';
import { CookieService } from 'ngx-cookie-service';
import { CookieNames } from '../cookieNames';

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
  getAuthToken(): string | null {
    return this.authToken !== null
      ? this.authToken
      : this.cookieService.get(this.cookieNames.authenticationToken);
  }

  getUserData(): userData | null {
    return this.userData;
  }

  isUserAuthenticated(): boolean {
    if (!this.isAuthenticated) {
      const token = this.cookieService.get(
        this.cookieNames.authenticationToken
      );
      if (token !== null || token !== undefined) {
        if (this.userData === null) {
          const data = this.userProfileAPI();
          data.pipe(take(1)).subscribe(
            (response: userData) => {
              this.setUserData(response);
            },
            (error) => {
              // Handle errors from the API
              console.error('API Error:', error);
              // You can also display an error message to the user
            }
          );
        }
        this.setAuthenticated(true);
      }
    }
    return this.isAuthenticated;
  }

  // api calls
  userProfileAPI(): Observable<any> {
    const token = this.cookieService.get(this.cookieNames.authenticationToken);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const getUserProfileUrl = `${this.apiUrl}/user-profile`;
    return this.http.get(getUserProfileUrl, { headers });
  }

  public loginAPI(formData: loginRequestModel): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`;
    return this.http.post(loginUrl, formData);
  }

  public logoutAPI() {
    const token =
      this.authToken === null
        ? this.cookieService.get(this.cookieNames.authenticationToken)
        : this.authToken;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const logoutUrl = `${this.apiUrl}/logout`;
    return this.http.post(logoutUrl, { headers });
  }

  // normal auth functions
  public logout() {
    this.logoutAPI();
    this.authToken = null;
    this.userData = null;
    this.isAuthenticated = false;
  }
}
