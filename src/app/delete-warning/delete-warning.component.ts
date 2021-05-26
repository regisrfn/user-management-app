import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-delete-warning',
  templateUrl: './delete-warning.component.html',
  styleUrls: ['./delete-warning.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteWarningComponent implements OnInit {

  @Output() confirm: EventEmitter<{ isConfirmed: boolean }> = new EventEmitter();
  @Input() isClosed = true;
  @Input() data: any
  constructor() { }

  ngOnInit(): void { }

  closeBtn() {
    this.confirm.emit({ isConfirmed: false });
  }
  cancelBtn() {
    this.confirm.emit({ isConfirmed: false });
  }
  deleteBtn() {
    this.confirm.emit({ isConfirmed: true });
  }

}