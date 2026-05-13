import {ChangeDetectionStrategy, Component, HostBinding, Inject, TemplateRef} from '@angular/core';
import {OVERLAY_REF, OverlayRef} from '@sndvll/core';

@Component({
  template: `<ng-container [ngTemplateOutlet]="template"></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDropdownComponent {

  @HostBinding('class') classList = 'select-dropdown';
  public template: TemplateRef<any>;

  constructor(@Inject(OVERLAY_REF) private overlayRef: OverlayRef<SelectDropdownComponent, TemplateRef<any>>) {
    this.template = overlayRef.config.data!;
  }

}
