import {Component, HostBinding, HostListener, Inject, OnInit} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';
import {ToastConfig, ToastType} from './toast.config';
import {interval} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';

@Component({
  templateUrl: './toast.component.html'
})
export class ToastComponent implements OnInit {

  public config: ToastConfig;
  public icon: string = 'info';
  public progress = 0;
  public total = 100;

  @HostBinding('class') classes = 'flex flex-col rounded shadow-lg cursor-pointer';
  @HostBinding('class.bg-gray-200') info: boolean;
  @HostBinding('class.bg-green-400') success: boolean;
  @HostBinding('class.bg-yellow-400') warning: boolean;
  @HostBinding('class.bg-red-400') error: boolean;

  @HostBinding('class.text-black') textBlack: boolean;
  @HostBinding('class.text-white') textWhite: boolean;

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef) {
    this.config = dialogRef.config.data;
    this.info = this.config.type === ToastType.Info;
    this.success = this.config.type === ToastType.Success;
    this.warning = this.config.type === ToastType.Warning;
    this.error = this.config.type === ToastType.Error;
    this.textBlack = this.info || this.warning;
    this.textWhite = this.success || this.error;

    if (this.info || this.success) {
      this.icon = 'info';
    }

    if (this.warning || this.error) {
      this.icon = 'alert-triangle';
    }

  }

  ngOnInit() {
    this._startTimer();
  }

  private _startTimer() {
    if (this.dialogRef.config.closable && this.config.time > 0) {
      this.total = this.config.time * 10;
      interval(100)
        .pipe(
          take(this.config.time * 10),
          map(time => {
            this.progress = time + 1;
            return this.progress;
          }),
          filter(v => v === (this.total)))
        .subscribe(() => this.close())
    }
  }

  @HostListener('click') click() {
    this.close();
  }

  close() {
    if (this.dialogRef.config.closable) {
      this.dialogRef.close();
    }
  }

}
