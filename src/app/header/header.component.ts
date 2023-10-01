import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { userData } from '../models/UserData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public logoImage: string = 'assets/standart-stickers/stickerwave-logo.jpg';
  public applicationName: string = environment.applicationName;
  public userName: string = '';
  public isMenuOpen: boolean = false;
  public isUserDropdownOpen: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {}

  public isLoggedIn(): boolean {
    return this.authenticationService.isUserAuthenticated();
  }

  public getUserName(): userData | null {
    const user = this.authenticationService.getUserData();
    user === null ? (this.userName = 'user') : (this.userName = user.name);
    return user;
  }

  public toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  public logout() {
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }
}
