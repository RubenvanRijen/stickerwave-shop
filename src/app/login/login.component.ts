import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { loginRequestModel } from '../models/LoginRequestModel';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { loginResponseModel } from '../models/LoginResponseModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public formData: loginRequestModel = {
    email: '',
    password: '',
  }; // Object to hold form data

  /**
   * constructor.
   * @param authenticationService
   * @param router
   */
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  /**
   * submit the login form. If success then set all the data for later usage.
   */
  onSubmit() {
    this.authenticationService
      .loginAPI<loginResponseModel>(this.formData)
      .pipe(take(1))
      .subscribe(
        (response: loginResponseModel) => {
          this.authenticationService.setAuthToken(response.access_token); // Store the token
          this.authenticationService.setUserData(response.user); // Store user data
          this.authenticationService.setAuthenticated(true); // Set authenticated state
          this.router.navigate(['/home']);
        },
        (error: any) => {
          console.error('API Error:', error);
        }
      );
  }
}
