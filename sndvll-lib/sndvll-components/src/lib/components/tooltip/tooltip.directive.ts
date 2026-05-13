import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {
  ConnectedOverlayConfigBuilder,
  OverlayConnectedPosition,
  OverlayRef,
  OverlayService
} from '@sndvll/core';
import {TooltipComponent} from './tooltip.component';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {

  private overlayRef: OverlayRef<TooltipComponent, string> | null = null;

  @Input('tooltip') message = ''

  constructor(private elementRef: ElementRef,
              private overlay: OverlayService) {
  }

  @HostListener('mouseenter') show() {
    if (!this.overlayRef) {
      const overlayConfig = new ConnectedOverlayConfigBuilder<TooltipComponent, string>()
        .data(this.message)
        .origin(this.elementRef.nativeElement)
        .preferredConnectedPosition(OverlayConnectedPosition.TopMiddle)
        .component(TooltipComponent)
        .withBackdrop(false)
        .config;
      this.overlayRef = this.overlay.open<TooltipComponent, string>(overlayConfig);
    }
  }

  @HostListener('mouseleave') hide() {
    if (this.overlayRef) {
      this.overlayRef.dismiss();
      this.overlayRef = null;
    }
  }

}
