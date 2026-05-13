import {Component, HostBinding, Inject, TemplateRef} from '@angular/core';
import {OVERLAY_REF, OverlayRef} from '@sndvll/core';

@Component({
  template: `
    <div class="first:rounded-t first:border-b last:rounded-b last:border-t">
      <ng-container *ngTemplateOutlet="templateRef"></ng-container>
    </div>
  `,
})
export class DropdownMenuComponent {

  public templateRef: TemplateRef<any>;

  @HostBinding('class') classList = 'dropdown-menu';

  constructor(@Inject(OVERLAY_REF) public overlayRef: OverlayRef<DropdownMenuComponent, TemplateRef<any>>) {
    this.templateRef = overlayRef.config.data!;
  }

}
