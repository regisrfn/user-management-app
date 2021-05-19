import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/model/user.model';

@Component({
  selector: 'app-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss']
})
export class NewUserModalComponent implements OnInit {

  newUser = new User
  constructor() { }

  ngOnInit(): void {
  }

}
