import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { userData } from '../models/UserData';

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

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    const user = this.authenticationService.getUserData();
    user === null ? (this.userName = 'user') : (this.userName = user.name);
  }

  isLoggedIn(): boolean {
    return this.authenticationService.isUserAuthenticated();
  }

  getUser(): userData | null {
    return this.authenticationService.getUserData();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
