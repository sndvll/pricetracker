import {Component, HostBinding, HostListener, Inject, ViewEncapsulation} from '@angular/core';
import {DialogRef} from './dialog.ref';
import {DIALOG_REF, DialogType, DialogXPosition, DialogYPosition} from './dialog.config';

@Component({
  template: '',
})
export class DialogBackdrop {

  @HostBinding('class') classes;

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef) {
    this.classes = `backdrop bg-${dialogRef.config.backdropColor} opacity-50 ${dialogRef.config.backdropClickThrough ? 'pointer-events-none' : 'pointer-events-auto'}`;
  }

  @HostListener('click') onBackdropClick() {
    if (this.dialogRef.config.closeOnBackdropClick) {
      this._close();
    }
  }

  @HostListener('document:keydown.escape') onEscKey() {
    this._close();
  }

  private _close() {
    if (this.dialogRef.config.closable) {
      this.dialogRef.close();
    }
  }
}

@Component({
  templateUrl: 'dialog.html',
  styleUrls: ['./dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Dialog {

  @HostBinding('class') classList = 'dialog';
  @HostBinding('class.full') full = this.dialogRef.config.type === DialogType.Full;
  @HostBinding('class.right') right = this.dialogRef.config.xPosition === DialogXPosition.Right;
  @HostBinding('class.left') left = this.dialogRef.config.xPosition === DialogXPosition.Left;
  @HostBinding('class.x-center') xCenter = this.dialogRef.config.xPosition === DialogXPosition.Center;
  @HostBinding('class.y-middle') yCenter = this.dialogRef.config.yPosition === DialogYPosition.Middle;
  @HostBinding('class.bottom') bottom = this.dialogRef.config.yPosition === DialogYPosition.Bottom;
  @HostBinding('class.top') top = this.dialogRef.config.yPosition === DialogYPosition.Top;
  @HostBinding('class.full-width') fullWidth = this.dialogRef.config.fullWidth;
  @HostBinding('class.full-height') fullHeight = this.dialogRef.config.fullHeight;
  @HostBinding('role') role: DialogType = DialogType.Modal;

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef) {
    this.role = dialogRef.config.type!;
  }

}

