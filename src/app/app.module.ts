import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './extensions/TokenInterceptor';
import { TokenInitializerService } from './services/tokenInitialize/token-initializer-service';
import { RegisterComponent } from './register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from './extensions/ErrorInterceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    TokenInitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitializer: TokenInitializerService) => () =>
        appInitializer.initializeApp(),
      deps: [TokenInitializerService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
