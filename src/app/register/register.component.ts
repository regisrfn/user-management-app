import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../shared/model/user.model';
import { AuthenticationService } from '../shared/service/authentication.service';
import { NotificationService } from '../shared/service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  loading = false
  newUser = new User

  constructor(private router: Router,
    private authService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  public register(user: User) {
    this.loading = true
    this.authService.register(user)
      .then(res => {
        this.authService.logOut()
        this.sendSuccessfullyMsg();
        this.router.navigate(['/login']);
        this.loading = false;
      })
      .catch((err: HttpErrorResponse) => {
        this.sendErrorMsg(NotificationType.ERROR, err.error.message)
        this.loading = false;
      });
  }

  private sendSuccessfullyMsg() {
    this.notificationService.notify(NotificationType.SUCCESS, "You have been successfully registered.Please Check your email for password to log in");
  }

  private sendErrorMsg(ERROR: NotificationType, message: string) {
    if (message)
      this.notificationService.notify(ERROR, message);
    else
      this.notificationService.notify(ERROR, "An error occurred. Please try again.");
  }

}
