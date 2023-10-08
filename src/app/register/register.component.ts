import { Component } from '@angular/core';
import { userData } from '../models/UserData';
import { registerRequestModel } from '../models/RegisterRequestModel';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterResponseModel } from '../models/RegisterResponseModel';
import { SendEmailVerificationResponseModel } from '../models/SendEmailVerificationResponseModel';
import { SendEmailVerificationRequestModel } from '../models/SendEmailVerificationRequestModel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  /**
   * constructor.
   * @param authenticationService
   * @param router
   */
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  public userData: registerRequestModel = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  /**
   * send the registration form and then send the verification email if the registration was successfull.
   * @param registrationForm the form from the component.
   */
  onSubmit(registrationForm: NgForm) {
    if (registrationForm.valid && this.passwordsMatch()) {
      this.authenticationService
        .registerAPI<RegisterResponseModel>(this.userData)
        .pipe(take(1))
        .subscribe((response: RegisterResponseModel) => {
          const sendEmailObject: SendEmailVerificationRequestModel = {
            email: response.user.email,
            redirect_url: encodeURIComponent(
              this.authenticationService.getHomeUrl()
            ),
          };
          this.authenticationService
            .sendEmailVerificationLinkAPI<SendEmailVerificationResponseModel>(
              sendEmailObject
            )
            .pipe(take(1))
            .subscribe((response: SendEmailVerificationResponseModel) => {
              this.router.navigate(['/home']);
              this.toastrService.success('success message', 'Success');
            });
        });
    } else {
      console.error('Form is invalid.');
    }
  }

  /**
   * see if the password and verification password are the same.
   * @returns boolean
   */
  public passwordsMatch(): boolean {
    return this.userData.password === this.userData.password_confirmation;
  }
}
