import { Component } from '@angular/core';
import { userData } from '../models/UserData';
import { registerRequestModel } from '../models/RegisterRequestModel';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { catchError, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterResponseModel } from '../models/RegisterResponseModel';
import { SendEmailVerificationResponseModel } from '../models/SendEmailVerificationResponseModel';
import { SendEmailVerificationRequestModel } from '../models/SendEmailVerificationRequestModel';
import { ToastService } from '../services/toasts/toast.service';
import { LoadingService } from '../services/loading/loading.service';

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
    private toastService: ToastService
  ) {}

  public isLoading: boolean = false;
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
      this.isLoading = true;
      this.authenticationService
        .registerAPI<RegisterResponseModel>(this.userData)
        .pipe(
          take(1),
          catchError((error) => {
            this.toastService.showErrorToast(
              'Error',
              error.error.error.email[0]
            );
            this.isLoading = false;
            return throwError(error);
          })
        )
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
              this.isLoading = false;
              this.router.navigate(['/home']);
              this.toastService.showSuccessToast('Success', 'done');
            });
        }),
        (error: any) => {
          if (error.status === 400) {
            this.toastService.showErrorToast('Error', error);
          }
          this.isLoading = false;
        };
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
