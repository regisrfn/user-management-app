import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { environment } from 'src/environments/environment';
import { NotificationType } from '../shared/enum/notification-type.enum';
import { User } from '../shared/model/user.model';
import { UserService } from '../shared/service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  usersList: User[] = []
  imageUrl = `${environment.API_URL}/image/`
  refreshing = false

  constructor(private userService: UserService,
    private notificationService: NotifierService) { }

  ngOnInit(): void {
    this.userService.getUsers()
      .then(res => {
        this.usersList = res
      })
      .catch((err: HttpErrorResponse) => {
        this.sendErrorMsg(err.error.message);
      })
  }

  private sendErrorMsg(message: string) {
    if (message)
      this.notificationService.notify(NotificationType.ERROR, message);
    else
      this.notificationService.notify(NotificationType.ERROR, "An error occurred. Please try again.");
  }

  refreshUsers(showMsg = false) {
    this.refreshing=true
    this.userService.getUsers()
      .then(res => {
        this.usersList = res
        this.refreshing = false
        if (showMsg)
          this.notificationService.notify(NotificationType.SUCCESS, `Found ${res.length} users`);
      })
      .catch((err: HttpErrorResponse) => {
        this.refreshing=false
        this.sendErrorMsg(err.error.message);
      })
  }

  trackByFn(index: any, item: User) {
    return item.userId;
  }

}
