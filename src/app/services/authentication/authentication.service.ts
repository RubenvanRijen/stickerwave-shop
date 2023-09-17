import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginModel } from 'src/app/models/loginModel';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl:string = environment.apiURL+ "auth";


  constructor(private http: HttpClient) {}

  login(formData: LoginModel): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`; // Replace with the login endpoint
    return this.http.post(loginUrl, formData);
  }
}
