import {Component, HostBinding, Inject} from '@angular/core';
import {OVERLAY_REF, OverlayRef} from '@sndvll/core';

@Component({
  template: `
    {{message}}
    <svg x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve">
      <polygon class="fill-current" points="0,0 127.5,127.5 255,0"/>
    </svg>
  `
})
export class TooltipComponent {

  public message: string = '';

  @HostBinding('class') classList = 'tooltip-component'

  constructor(@Inject(OVERLAY_REF) private overlayRef: OverlayRef<TooltipComponent, string>) {
    this.message = overlayRef.config.data!;
  }

}
