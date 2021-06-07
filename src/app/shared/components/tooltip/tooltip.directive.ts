import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {
  ConnectedDialogConfigBuilder,
  DialogConnectedPosition,
  DialogRef,
  DialogService
} from '../../../core/dialog';
import {TooltipComponent} from './tooltip.component';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {

  private dialogRef: DialogRef<TooltipComponent, string> | null = null;

  @Input('tooltip') message = ''

  constructor(private elementRef: ElementRef,
              private dialog: DialogService) {
  }

  @HostListener('mouseenter') show() {
    if (!this.dialogRef) {
      const dialogConfig = new ConnectedDialogConfigBuilder<TooltipComponent, string>()
        .data(this.message)
        .origin(this.elementRef.nativeElement)
        .preferredConnectedPosition(DialogConnectedPosition.TopMiddle)
        .component(TooltipComponent)
        .withBackdrop(false)
        .config;
      this.dialogRef = this.dialog.open<TooltipComponent, string>(dialogConfig);
    }
  }

  @HostListener('mouseleave') hide() {
    if (this.dialogRef) {
      this.dialogRef.dismiss();
      this.dialogRef = null;
    }
  }

}
