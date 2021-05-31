import {Component, HostBinding, HostListener, Inject, OnInit,} from '@angular/core';
import {DialogRef} from './dialog.ref';
import {DIALOG_REF, DialogType, DialogXPosition, DialogYPosition} from './dialog.config';
import {DialogAnimationState, fadeIn} from './dailog.animations';

@Component({
  template: '',
  animations: [fadeIn(200, .5).transform],
  host: {
    '[@transform]': 'animationState'
  }
})
export class DialogBackdrop implements OnInit {

  public animationState: DialogAnimationState = DialogAnimationState.Void;

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef) {
    this.classes = `backdrop bg-${dialogRef.config.backdropColor} opacity-50}`;
  }

  @HostBinding('class') classes;

  @HostListener('click') onBackdropClick() {
    this._close();
  }

  @HostListener('document:keydown.escape') onEscKey() {
    this._close();
  }

  ngOnInit() {
    this.animationState = DialogAnimationState.Show;
  }

  private _close() {
    if (this.dialogRef.config.closable) {
      this.dialogRef.close();
    }
  }
}

@Component({
  templateUrl: 'dialog.html',
  animations: [fadeIn().transform],
  host: {
    '[@transform]': 'animationState'
  }
})
export class Dialog implements OnInit {

  public animationState: DialogAnimationState = DialogAnimationState.Void;

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef) {
    console.log(dialogRef);
  }

  @HostBinding('class') classList = 'dialog';
  @HostBinding('class.full') full = this.dialogRef.config.type === DialogType.Full;
  @HostBinding('class.right') right = this.dialogRef.config.xPosition === DialogXPosition.Right;
  @HostBinding('class.left') left = this.dialogRef.config.xPosition === DialogXPosition.Left;
  @HostBinding('class.x-center') xCenter = this.dialogRef.config.xPosition === DialogXPosition.Center;
  @HostBinding('class.y-center') yCenter = this.dialogRef.config.yPosition === DialogYPosition.Center;
  @HostBinding('class.bottom') bottom = this.dialogRef.config.yPosition === DialogYPosition.Bottom;
  @HostBinding('class.top') top = this.dialogRef.config.yPosition === DialogYPosition.Top;
  @HostBinding('class.full-width') fullWidth = this.dialogRef.config.fullWidth;
  @HostBinding('class.full-height') fullHeight = this.dialogRef.config.fullHeight;
  @HostBinding('role') role = 'dialog';

  ngOnInit() {
    this.animationState = DialogAnimationState.Show;
  }

}

