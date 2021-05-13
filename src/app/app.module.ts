import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { LoginComponent } from './login/login.component';
import { NotificationModule } from './module/notification/notification.module';
import { AuthenticationService } from './shared/service/authentication.service';
import { NotificationService } from './shared/service/notification.service';
import { UserService } from './shared/service/user.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NotificationModule,
    FormsModule
  ],
  providers: [
    AuthenticationService,
    UserService,
    NotificationService,
    {provide:HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
