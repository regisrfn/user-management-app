import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/shared/enum/notification-type.enum';
import { HttpResponse } from 'src/app/shared/model/http-response.model';
import { User } from 'src/app/shared/model/user.model';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { UserService } from 'src/app/shared/service/user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit, OnChanges {

  @ViewChild("editUserForm") formUser: NgForm | undefined
  @ViewChild('btnClose') btnClose: ElementRef | undefined;
  @Output() closed: EventEmitter<{ isClosed: boolean }> = new EventEmitter();
  @Input() editUser: User | undefined

  formData = new FormData();
  previewImgURL: string | ArrayBuffer | null | undefined
  loading = false;
  httpResponse: HttpResponse | undefined
  file: File | undefined
  fileStatus = { percentage: 0, status: "start" }
  subscriptions: Subscription[] = []

  constructor(private notificationService: NotificationService,
    private userService: UserService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.editUser.currentValue)
      this.previewImgURL = this.editUser?.image
  }

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

      this.file = files[0]
      this.formData.set('file', this.file, this.file.name);

      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (_event) => {
        this.previewImgURL = reader.result;
      }
    }
  }

  public unselectFiles() {
    this.formData.delete('file')
    this.file = undefined
    this.previewImgURL = this.editUser?.image
  }

  public onSelectRole(selectInput: HTMLSelectElement) {
    if (this.editUser)
      this.editUser.role = selectInput.value
    this.formUser?.form.markAsDirty()
  }

  public close() {
    this.reset()
    this.closed.emit({ isClosed: true })
  }

  public save() {
    if (!this.editUser)
      return
    this.httpResponse = undefined
    this.loading = true
    this.userService.updateUser(this.editUser)
      .then(res => {
        this.loading = false
        this.notificationService.notify(NotificationType.SUCCESS, "User updated successfully.")
        this.resetFormValidation()
      })
      .catch((err: HttpErrorResponse) => {
        this.httpResponse = err.error
        this.loading = false
        this.sendErrorMsg(err.error?.message)
      })
  }

  private reset() {
    this.resetFormValidation()
    this.editUser = new User
    this.formData = new FormData
    this.previewImgURL = undefined
    this.file = undefined
    this.fileStatus = { percentage: 0, status: "start" }
  }

  public updateProfileImg() {
    if (!this.editUser?.userId)
      return

    this.subscriptions.push(
      this.userService.updateProfileImage(this.formData, this.editUser.userId).subscribe(
        (event: HttpEvent<any>) => {
          this.handleUploadProgress(event)
        },
        (err: HttpErrorResponse) => {
          let error = err.error as HttpResponse
          this.sendErrorMsg(error.message)
          this.unselectFiles()
        }
      )
    )
  }

  private sendErrorMsg(message: string) {
    if (message)
      this.notificationService.notify(NotificationType.ERROR, message);
    else
      this.notificationService.notify(NotificationType.ERROR, "An error occurred. Please try again.");
  }

  private resetFormValidation() {
    this.formUser?.form.markAsPristine();
    this.formUser?.form.markAsUntouched();
    this.formUser?.form.updateValueAndValidity();
  }

  private handleUploadProgress(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        if (event.total) {
          this.fileStatus.percentage = Math.round(100 * event.loaded / event.total)
          this.fileStatus.status = "progress"
        }
        break;

      case HttpEventType.Response:
        if (event.status === 200) {
          this.fileStatus.status = "uploaded"
          this.unselectFiles()
          this.previewImgURL = this.editUser?.image + '?time=' + new Date().getTime()
          this.fileStatus = { percentage: 0, status: "start" }
          this.sendSuccessfullyUpdatedMsg()
        }
        break;

      default:
        break;
    }
  }

  private sendSuccessfullyUpdatedMsg() {
    this.notificationService.notify(NotificationType.SUCCESS, "Profile image was saved.");

  }
}
