import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/shared/enum/notification-type.enum';
import { HttpResponse } from 'src/app/shared/model/http-response.model';
import { User } from 'src/app/shared/model/user.model';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { UserService } from 'src/app/shared/service/user.service';
import { environment } from 'src/environments/environment';

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
  subscriptions: Subscription[] = []

  constructor(private notificationService: NotificationService,
    private userService: UserService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.editUser.currentValue)
      this.previewImgURL = `${environment.API_URL}/image/` + this.editUser?.userId
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
    this.previewImgURL = `${environment.API_URL}/image/` + this.editUser?.userId
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
        this.sendErrorMsg(NotificationType.ERROR, err.error?.message)
      })
  }

  private reset() {
    this.resetFormValidation()
    this.editUser = new User
    this.formData = new FormData
    this.previewImgURL = undefined
    this.file = undefined
  }

  public updateProfileImg() {

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
