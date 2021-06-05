import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  ViewEncapsulation
} from '@angular/core';
import {DialogRef} from './dialog.ref';
import {DIALOG_REF, DialogConnectedPosition, DialogType, DialogXPosition, DialogYPosition} from './dialog.config';

@Component({
  template: '',
})
export class DialogBackdrop {

  @HostBinding('class') classes = '';
  @HostBinding('class.connected') isConnected = this.dialogRef.config.type === DialogType.Connected;
  @HostBinding('class.pointer-events-none') pointerEventsNone = this.dialogRef.config.backdropClickThrough;
  @HostBinding('class.pointer-events-auto') pointerEventsAuto = !this.dialogRef.config.backdropClickThrough;

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef) {
    this.classes = `backdrop bg-${this.dialogRef.config.backdropColor ?? 'black'} opacity-${this.dialogRef.config.backdropOpacity ?? '50'}`;
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
  @HostBinding('class.toast') isToast = this.dialogRef.config.type === DialogType.Toast;
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
export class ConnectedDialog implements AfterViewInit {

  @HostBinding('class') classList = 'connected-dialog';

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef,
              private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    this._reposition(this.dialogRef.config.preferredConnectedPosition ?? DialogConnectedPosition.BottomLeft);
  }

  @HostListener('window:scroll') onScroll() {
    this._reposition(this.dialogRef.config.preferredConnectedPosition ?? DialogConnectedPosition.BottomLeft);
  }

  @HostListener('window:resize') onResize() {
    this._reposition(this.dialogRef.config.preferredConnectedPosition ?? DialogConnectedPosition.BottomLeft);
  }

  private _reposition(position: DialogConnectedPosition) {
    const elementRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
    this.dialogRef.reposition({
      elementRect,
      position,
      parentWide: this.dialogRef.config.parentWide
    });
  }

}
