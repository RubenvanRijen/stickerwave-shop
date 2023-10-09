import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { loginRequestModel } from '../models/LoginRequestModel';
import { Router } from '@angular/router';
import { catchError, take, throwError } from 'rxjs';
import { loginResponseModel } from '../models/LoginResponseModel';
import { LoadingService } from '../services/loading/loading.service';
import { ToastService } from '../services/toasts/toast.service';

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
    private router: Router,
    private loadingService: LoadingService,
    private toastService: ToastService
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
          this.toastService.showErrorToast(
            'Error',
            'Verkeerde gegevens ingevuld'
          );
        }
      );
  }
  /**
   * check if the http is still pending.
   * @returns boolean
   */
  isLoading(): boolean {
    return this.loadingService.isLoading();
  }
}
