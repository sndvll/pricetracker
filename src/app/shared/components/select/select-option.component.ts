import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input} from '@angular/core';
import {SelectOption} from './select.component';

@Component({
  selector: 'sndvll-select-option',
  templateUrl: './select-option.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectOptionComponent {

  private _option!: SelectOption;

  @HostBinding('class') classList = 'select-option';
  @HostBinding('class.border-blue-200') isSelected = false;

  @Input() set option(option: SelectOption) {
    this._option = option;
    this.isSelected = this._option.selected ?? false;
    this.changeDetectorRef.markForCheck();
  }
  get option(): SelectOption {
    return this._option;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

}
