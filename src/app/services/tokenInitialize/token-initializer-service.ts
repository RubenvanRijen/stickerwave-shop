import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { userData } from 'src/app/models/UserData';

@Injectable({
  providedIn: 'root',
})
export class TokenInitializerService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  async initializeApp() {
    const token = this.authenticationService.getAuthToken();
    if (token) {
      // TODO promise must be removed but for now the best way to make everything wait till this has been done.
      const data = await this.authenticationService
        .userProfileAPI<userData>()
        .toPromise();
      if (data !== undefined) {
        this.authenticationService.setUserData(data);
        this.authenticationService.setAuthenticated(true);
      }
    }
  }
}
