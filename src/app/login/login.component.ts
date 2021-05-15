import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderType } from '../shared/enum/header-type.enum';
import { NotificationType } from '../shared/enum/notification-type.enum';
import { User } from '../shared/model/user.model';
import { AuthenticationService } from '../shared/service/authentication.service';
import { NotificationService } from '../shared/service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false
  loginUser = new User

  constructor(private router: Router,
    private authService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.authService.loadToken()    
    if (this.authService.geToken())
      this.router.navigateByUrl("/");
    else
      this.router.navigateByUrl("/login");
  }

  public login(user: User) {
    this.loading = true
    this.authService.login(user)
      .then(res => {
        const token = res.headers.get(HeaderType.JWT_TOKEN);
        if (token && res.body) {
          this.authService.storageToken(token);
          this.authService.storageUser(res.body);
          this.authService.loadToken();
          this.router.navigate(['/']);
        }
        this.loading = false;
      })
      .catch((err: HttpErrorResponse) => {
        this.sendErrorMsg(NotificationType.ERROR, err.error.message)
        this.loading = false;
      });
  }

  private sendErrorMsg(ERROR: NotificationType, message: string) {
    if (message)
      this.notificationService.notify(ERROR, message);
    else
      this.notificationService.notify(ERROR, "An error occurred. Please try again.");
  }

}
