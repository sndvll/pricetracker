import {ChangeDetectionStrategy, Component, HostBinding, Inject} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';
import {AlertConfig, AlertType} from './alert.service';
import {FormControl} from '@angular/forms';

@Component({
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent<D = any> {

  @HostBinding('class') classList = 'block rounded shadow bg-white dark:bg-black text-black dark:text-white select-none p-6 w-96 max-w-xs';

  public formControl: FormControl;

  public alertConfig!: AlertConfig;

  constructor(@Inject(DIALOG_REF) private dialogRef: DialogRef<AlertComponent<D>, AlertConfig>) {
    this.alertConfig = dialogRef.config.data!;
    this.formControl = new FormControl(this.alertConfig.data ?? '');
  }

  close<D>(reason?: D) {
    this.dialogRef.dismiss<D>(reason);
  }

  get iconColor(): string {
    return {
      [AlertType.Info]: 'text-gray-300',
      [AlertType.Warning]: 'text-red-400',
      [AlertType.Input]: 'text-green-400',
    }[this.alertConfig.type];

  }

  get icon(): string {
    return {
      [AlertType.Info]: 'info',
      [AlertType.Warning]: 'alert-triangle',
      [AlertType.Input]: 'edit',
    }[this.alertConfig.type];
  }

  get disabledButton(): boolean {
    return !this.formControl.value ||
      this.formControl.value.toLowerCase() === this.alertConfig.data?.toLowerCase();
  }

}
