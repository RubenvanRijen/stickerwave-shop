import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { userData } from '../models/UserData';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public logoImage: string = 'assets/standart-stickers/stickerwave-logo.jpg';
  public applicationName: string = environment.applicationName;
  public userName: string = '';
  public isUserDropdownOpen: boolean = false;

  /**
   * constructor
   * @param authenticationService
   * @param router
   */
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  /**
   * is the user authenticated.
   * @returns boolean
   */
  public isLoggedIn(): boolean {
    return this.authenticationService.isUserAuthenticated();
  }

  /**
   * this function return the name of the user or just user.
   * @returns userData or null
   */
  public getUserName(): userData | null {
    const user = this.authenticationService.getUserData();
    user === null ? (this.userName = 'user') : (this.userName = user.name);
    return user;
  }

  /**
   * toggle the dropdown menu for in the component.
   */
  public toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  /**
   * logout the user via the service and then redirect.
   */
  public logout() {
    this.authenticationService
      .logoutAPI()
      .pipe(take(1))
      .subscribe(() => {
        this.authenticationService.logout();
      });
    this.router.navigate(['/home']);
  }
}
