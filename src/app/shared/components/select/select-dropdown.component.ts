import {ChangeDetectionStrategy, Component, HostBinding, Inject, TemplateRef} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';

@Component({
  template: `<ng-container [ngTemplateOutlet]="template"></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDropdownComponent {

  @HostBinding('class') classList = 'select-dropdown';
  public template: TemplateRef<any>;

  constructor(@Inject(DIALOG_REF) private dialogRef: DialogRef<SelectDropdownComponent, TemplateRef<any>>) {
    this.template = dialogRef.config.data!;
  }

}
