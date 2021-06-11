import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';
import {AlertConfig, AlertType} from './alert.service';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent<D = any> implements OnInit, OnDestroy {

  private _onDestroy = new Subject<void>();

  private _disabledButton = true;
  set disabledButton(value: boolean) {
    this._disabledButton = value;
    this.changeDetectorRef.markForCheck();
  }
  get disabledButton() {
    if (this.alertConfig.type === AlertType.Input) {
      return !this.inputControl.value ||
        this.inputControl.value.toLowerCase() === this.alertConfig.data?.toLowerCase();
    }
    return this._disabledButton;
  }

  @HostBinding('class') classList = 'alert';

  public inputControl: FormControl;
  public toggleControl: FormControl;

  public alertConfig!: AlertConfig;

  constructor(@Inject(DIALOG_REF) private dialogRef: DialogRef<AlertComponent<D>, AlertConfig>,
              private changeDetectorRef: ChangeDetectorRef) {
    this.alertConfig = dialogRef.config.data!;
    this.inputControl = new FormControl(this.alertConfig.data ?? '');
    this.toggleControl = new FormControl(false);
  }

  ngOnInit() {
    this.toggleControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(value => this.disabledButton = !value);
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
