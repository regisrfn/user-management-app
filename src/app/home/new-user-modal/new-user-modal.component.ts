import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationType } from 'src/app/shared/enum/notification-type.enum';
import { User } from 'src/app/shared/model/user.model';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { UserService } from 'src/app/shared/service/user.service';

@Component({
  selector: 'app-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss']
})
export class NewUserModalComponent implements OnInit {

  @ViewChild("saveUserForm") formUser: NgForm | undefined
  @ViewChild('btnClose') btnClose: ElementRef | undefined;
  newUser = new User
  formData = new FormData();
  previewImgURL: string | ArrayBuffer | null | undefined

  constructor(private notificationService: NotificationService,
    private userService: UserService) { }

  ngOnInit(): void {
  }

  public selectFiles(input: HTMLInputElement) {
    const files = input.files;

    if (files && files[0]) {

      var mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.notificationService.notify(NotificationType.ERROR, "Only images are supported.")
        return;
      }

      this.formData.append('file', files[0], files[0].name);

      var reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.previewImgURL = reader.result;
      }
    }
  }

  public unselectFiles() {
    this.formData.delete('file')
    this.previewImgURL = undefined
  }

  public onSelectRole(selectInput: HTMLSelectElement) {
    this.newUser.role = selectInput.value
  }

  public close() {
    this.reset()
  }

  public save() {
    let btn = this.btnClose?.nativeElement as HTMLButtonElement
    this.formData.append('user', new Blob([JSON.stringify(this.newUser)], { type: "application/json" }))

    this.userService.saveUser(this.formData)
      .then(res => {
        this.notificationService.notify(NotificationType.SUCCESS, "New user saved successfully.")
        btn.click()
      })
      .catch((err: HttpErrorResponse) => {
        this.sendErrorMsg(NotificationType.ERROR, err.error?.message)
      })
  }

  private reset() {
    this.resetFormValidation()
    this.newUser = new User
    this.formData = new FormData
    this.previewImgURL = undefined
  }

  private sendErrorMsg(ERROR: NotificationType, message: string) {
    if (message)
      this.notificationService.notify(ERROR, message);
    else
      this.notificationService.notify(ERROR, "An error occurred. Please try again.");
  }

  private resetFormValidation() {
    this.formUser?.form.markAsPristine();
    this.formUser?.form.markAsUntouched();
    this.formUser?.form.updateValueAndValidity();
  }

}
