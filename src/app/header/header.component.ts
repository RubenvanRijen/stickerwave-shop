import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public logoImage: string = "assets/standart-stickers/stickerwave-logo.jpg"
  public applicationName: string = environment.applicationName;
   
  public isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
