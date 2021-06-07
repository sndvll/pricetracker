import {ChangeDetectionStrategy, Component, HostBinding, Inject} from '@angular/core';
import {SelectOption} from './select.component';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';

@Component({
  templateUrl: './select-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDropdownComponent {

  public options: SelectOption[] = [];

  @HostBinding('class') classList = 'select-dropdown';

  select(selected: SelectOption) {
    const options = this.options.map(option => option === selected ?
      {...option, selected: true} : {...option, selected: false});
    this.dialogRef.dismiss(options);
  }

  constructor(@Inject(DIALOG_REF) private dialogRef: DialogRef<SelectDropdownComponent, SelectOption[]>) {
    this.options = dialogRef.config.data!;
  }

}
