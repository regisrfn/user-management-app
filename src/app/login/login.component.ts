import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from '../enum/notification-type.enum';
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
  }

  public login(user: User) {
    this.loading = true
    this.authService.login(user)
      .then(res => {
        this.loading = false
      })
      .catch((err: HttpErrorResponse) => {
        this.notificationService.notify(NotificationType.ERROR, err.error.message)
        this.loading = false
      })
  }

}
