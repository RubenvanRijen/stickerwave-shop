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

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  onSubmit() {
    this.authenticationService
      .loginAPI(this.formData)
      .pipe(take(1))
      .subscribe(
        (response: loginResponseModel) => {
          this.authenticationService.setAuthToken(response.access_token); // Store the token
          this.authenticationService.setUserData(response.user); // Store user data
          this.authenticationService.setAuthenticated(true); // Set authenticated state
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('API Error:', error);
        }
      );
  }
}
