import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'asset-icon',
  template: `<i class="cf {{symbol}}"></i>`
})
export class AssetIconComponent {

  private _symbol!: string;

  @HostBinding('class') classList = 'asset-icon';
  @Input()
  set symbol(value: string) {
    this._symbol = `cf-${value}`;
  }
  get symbol(): string {
    return this._symbol;
  }

}
