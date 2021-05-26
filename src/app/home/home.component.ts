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
  editMode = false
  showDeleteModel = false
  isDeleting = false

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

  public onUpdateUser(user: User) {
    this.selectedUser = Object.assign({}, user)
  }

  public deleteUser(event: { isConfirmed: boolean }) {
    if (event.isConfirmed && this.selectedUser?.userId) {
      this.userService.deleteUser(this.selectedUser.userId)
        .then(res => {
          this.sendSuccessfullyMsg(res.message)
          this.showDeleteModel = false
          this.refreshUsers(true)
        })
        .catch((err: HttpErrorResponse) => {
          let error = err.error as HttpResponse
          this.sendErrorMsg(error.message)
        });
    }else {
      this.showDeleteModel = false
      this.selectedUser = undefined
    }
  }

  public confirmDelete(user:User){
    this.selectedUser = user
    this.showDeleteModel = true
    console.log(user);
    
  }

  private sendErrorMsg(message: string) {
    if (message)
      this.notificationService.notify(NotificationType.ERROR, message);
    else
      this.notificationService.notify(NotificationType.ERROR, "An error occurred. Please try again.");
  }

  private sendSuccessfullyMsg(message: string) {
    if (message)
      this.notificationService.notify(NotificationType.SUCCESS, message);
    else
      this.notificationService.notify(NotificationType.SUCCESS, "Successfully operation.");
  }

  private handleUnauthorizedRequest(err: HttpErrorResponse): void {
    const response: HttpResponse = err.error as HttpResponse
    if (response.httpStatusCode === 401
      && response.message === "Your session has expired. Please log in again.") {
      this.authService.logOut()
      this.router.navigateByUrl("/login")
    }

  }

  public trackByFn(index: any, item: User) {
    return item.userId;
  }

}
