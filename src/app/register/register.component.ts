import { Component } from '@angular/core';
import { userData } from '../models/UserData';
import { registerRequestModel } from '../models/RegisterRequestModel';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { registerResponseModel } from '../models/RegisterResponseModel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  public userData: registerRequestModel = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  onSubmit(registrationForm: NgForm) {
    if (registrationForm.valid && this.passwordsMatch()) {
      this.authenticationService
        .registerAPI(this.userData)
        .pipe(take(1))
        .subscribe((response: registerResponseModel) => {
          this.authenticationService.setAuthToken(response.access_token); // Store the token
          this.authenticationService.setUserData(response.user); // Store user data
          this.authenticationService.setAuthenticated(true); // Set authenticated state
          this.router.navigate(['/home']);
        });
    } else {
      console.error('Form is invalid.');
    }
  }

  public passwordsMatch(): boolean {
    return this.userData.password === this.userData.password_confirmation;
  }
}
