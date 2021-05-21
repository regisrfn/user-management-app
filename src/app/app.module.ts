import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './shared/interceptor/auth.interceptor';
import { LoginComponent } from './login/login.component';
import { NotificationModule } from './shared/module/notification/notification.module';
import { AuthenticationService } from './shared/service/authentication.service';
import { NotificationService } from './shared/service/notification.service';
import { UserService } from './shared/service/user.service';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { UserInfoModalComponent } from './home/user-info-modal/user-info-modal.component';
import { NewUserModalComponent } from './home/new-user-modal/new-user-modal.component';
import { LoaderComponent } from './loader/loader.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    UserInfoModalComponent,
    NewUserModalComponent,
    LoaderComponent
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
