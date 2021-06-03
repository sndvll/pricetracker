import {Component, Directive, ElementRef, HostBinding, HostListener, Inject, ViewEncapsulation} from '@angular/core';
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

  @HostListener('scroll', ['$event']) onScroll(event: any) {
    console.log(event);
    this.dialogRef.scrolling(event);
  }

  private _close() {
    if (this.dialogRef.config.closable) {
      this.dialogRef.close();
    }
  }
}

@Component({
  template: `
    <div class="dialog-content" [class]="dialogRef?.config?.classes">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GlobalDialog {

  @HostBinding('class') classList = 'dialog';
  @HostBinding('class.full') full = this.dialogRef.config.type === DialogType.Full;
  @HostBinding('class.right') right = this.dialogRef.config.x === DialogXPosition.Right;
  @HostBinding('class.left') left = this.dialogRef.config.x === DialogXPosition.Left;
  @HostBinding('class.x-center') xCenter = this.dialogRef.config.x === DialogXPosition.Center;
  @HostBinding('class.y-middle') yCenter = this.dialogRef.config.y === DialogYPosition.Middle;
  @HostBinding('class.bottom') bottom = this.dialogRef.config.y === DialogYPosition.Bottom;
  @HostBinding('class.top') top = this.dialogRef.config.y === DialogYPosition.Top;
  @HostBinding('class.full-width') fullWidth = this.dialogRef.config.fullWidth;
  @HostBinding('class.full-height') fullHeight = this.dialogRef.config.fullHeight;
  @HostBinding('role') role: DialogType = DialogType.Modal;

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef) {
    this.role = dialogRef.config.type!;
  }

}

@Component({
  template: '<ng-content></ng-content>',
  styleUrls: ['./dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConnectedDialog {

  @HostBinding('class') classList = 'connected-dialog';

  @HostListener('window:scroll', ['$event']) onScroll(event: Event) {
    this.dialogRef.scrolling(event)
  }

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef) {}
}
