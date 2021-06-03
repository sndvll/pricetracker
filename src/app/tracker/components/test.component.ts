import {Component, HostBinding, Inject} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../core/dialog';
import {ToastConfigBuilder, ToastService} from '../../shared/components/toast';

@Component({
  template: `
    <div>
      <span>Hej test</span>
      <button (click)="openToast()">Toast!</button>
      <button (click)="close()">Close</button>
    </div>
  `
})
export class TestComponent {

  @HostBinding('class') classList = 'bg-black text-white p-5 shadow';

  constructor(@Inject(DIALOG_REF) private dialogRef: DialogRef,
              private toast: ToastService) {
  }

  close() {
    this.dialogRef.close();
  }

  openToast() {
    this.toast.open(ToastConfigBuilder.info({time: 0, message: 'Skitmeddelande'}));
  }
}
