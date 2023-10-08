import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { userData } from 'src/app/models/UserData';
import { RefreshResponseModel } from 'src/app/models/RefreshResponseModel';

@Injectable({
  providedIn: 'root',
})
export class TokenInitializerService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  /**
   * when the app is being initialized check wether there is a token.
   * if there is make a user call api to get user data. Otherwise refresh then token and then get the data.
   * Or ignore and do nothing, so user needs to login manually.
   */
  initializeApp() {
    const token = this.authenticationService.getAuthToken();
    if (token) {
      this.authenticationService.userProfileAPI<userData>().subscribe(
        (data) => {
          this.authenticationService.setUserData(data);
          this.authenticationService.setAuthenticated(true);
        },
        (error: any) => {
          console.log(`error: ${error}`);
        }
      );
    }
  }
}
