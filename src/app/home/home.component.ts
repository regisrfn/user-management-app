import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { environment } from 'src/environments/environment';
import { NotificationType } from '../shared/enum/notification-type.enum';
import { HttpResponse } from '../shared/model/http-response.model';
import { User } from '../shared/model/user.model';
import { AuthenticationService } from '../shared/service/authentication.service';
import { UserService } from '../shared/service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('userInfoBtn') userInfoBtn: ElementRef | undefined;
  usersList: User[] = []
  imageUrl = `${environment.API_URL}/image/`
  refreshing = false
  selectedUser: User | undefined

  constructor(private userService: UserService,
    private notificationService: NotifierService,
    private router: Router,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.userService.getUsers()
      .then(res => {
        this.usersList = res
      })
      .catch((err: HttpErrorResponse) => {
        this.sendErrorMsg(err.error.message);
        this.handleUnauthorizedRequest(err);
      })
  }

  refreshUsers(showMsg = false) {
    this.refreshing = true
    this.userService.getUsers()
      .then(res => {
        this.usersList = res
        this.refreshing = false
        if (showMsg)
          this.notificationService.notify(NotificationType.SUCCESS, `${res.length} user(s) loaded successfully.`);
      })
      .catch((err: HttpErrorResponse) => {
        this.refreshing = false
        this.sendErrorMsg(err.error.message);
        this.handleUnauthorizedRequest(err)
      })
  }

  public showUserInfo(user: User) {
    this.selectedUser = user
    let btn = this.userInfoBtn?.nativeElement as HTMLButtonElement
    btn?.click()
  }

  private sendErrorMsg(message: string) {
    if (message)
      this.notificationService.notify(NotificationType.ERROR, message);
    else
      this.notificationService.notify(NotificationType.ERROR, "An error occurred. Please try again.");
  }

  private handleUnauthorizedRequest(err: HttpErrorResponse): void {
    const response: HttpResponse = err.error as HttpResponse
    if (response.httpStatusCode === 401
      && response.message === "Your session has expired. Please log in again.") {
      this.authService.logOut()
      this.router.navigateByUrl("/login")
    }

  }

  trackByFn(index: any, item: User) {
    return item.userId;
  }

}
