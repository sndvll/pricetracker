import {Component, HostBinding, Inject, TemplateRef} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';

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

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef<DropdownMenuComponent, TemplateRef<any>>) {
    this.templateRef = dialogRef.config.data!;
  }

}
