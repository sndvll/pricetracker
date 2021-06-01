import {Component, HostBinding, HostListener, Inject, OnInit} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';
import {ToastConfig, ToastType} from './toast.config';
import {interval} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';

@Component({
  template : `
   <icon [name]="icon"></icon>
   <span class="ml-3">{{this.config.message}}</span>
  `
})
export class ToastComponent implements OnInit {

  public config: ToastConfig;
  public icon: string = 'info';

  @HostBinding('class') classes = 'flex p-5 rounded shadow-lg cursor-pointer';
  @HostBinding('class.bg-gray-200') info: boolean;
  @HostBinding('class.bg-green-400') success: boolean;
  @HostBinding('class.bg-yellow-400') warning: boolean;
  @HostBinding('class.bg-red-400') error: boolean;

  @HostBinding('class.text-black') textBlack: boolean;
  @HostBinding('class.text-white') textWhite: boolean;

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef) {
    console.log(dialogRef.config.data);
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
    this._setupTimer();
  }

  private _setupTimer() {
    if (this.dialogRef.config.closable && this.config.time > 0) {
      interval(1000)
        .pipe(
          take(this.config.time),
          map(v => v + 1),
          filter(v => v === this.config.time))
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
