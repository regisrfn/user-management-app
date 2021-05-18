import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/model/user.model';

@Component({
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.scss']
})
export class UserInfoModalComponent implements OnInit {

  @Input() idModal: string | undefined
  @Input() user: User | undefined

  constructor() { }

  ngOnInit(): void {
  }

}
