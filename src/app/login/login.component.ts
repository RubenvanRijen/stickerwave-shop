import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { LoginModel } from '../models/loginModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public formData: LoginModel = {
    email: '',
    password: '',
  }; // Object to hold form data

  constructor(private authenticationService: AuthenticationService) {}

  onSubmit() {
    this.authenticationService.login(this.formData).subscribe(
      (response) => {
        // Handle a successful response from the API
        console.log('API Response:', response);
        // Redirect or perform other actions as needed
      },
      (error) => {
        // Handle errors from the API
        console.error('API Error:', error);
        // You can also display an error message to the user
      }
    );
  }
}
