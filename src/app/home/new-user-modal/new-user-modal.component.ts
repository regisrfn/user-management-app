import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationType } from 'src/app/shared/enum/notification-type.enum';
import { User } from 'src/app/shared/model/user.model';
import { NotificationService } from 'src/app/shared/service/notification.service';

@Component({
  selector: 'app-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss']
})
export class NewUserModalComponent implements OnInit {

  @ViewChild("saveUserForm") formUser: NgForm | undefined
  newUser = new User
  formData = new FormData();
  previewImgURL: string | ArrayBuffer | null | undefined

  constructor(private notificationService: NotificationService) { }

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

  private reset() {
    this.formUser?.reset()
    this.formData = new FormData()
    this.newUser = new User
    this.previewImgURL = undefined
  }

}
