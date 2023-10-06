import { Component } from '@angular/core';
import { environment } from '../../environments/environment.development';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public currentYear: number;
  public applicationName = environment.applicationName;
  
  public dragonSkyrimImage = "assets/standart-stickers/skyrim-dragon.jpg"
  public arrowSkyrimImage = "assets/standart-stickers/skyrim-arrow.jpg"
  public pikachuImage = "assets/standart-stickers/pikachu.jpg"
  
  /**
   * constructor
   */
  constructor() {
    this.currentYear = new Date().getFullYear();
  }
  

}
