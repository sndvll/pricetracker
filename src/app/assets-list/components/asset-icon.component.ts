import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'asset-icon',
  template: `<i class="cf {{symbol}}"></i>`
})
export class AssetIconComponent {

  private _symbol!: string;

  @HostBinding('class') classList = 'w-10 h-10 flex items-center justify-center rounded-full text-2xl';
  @Input()
  set symbol(value: string) {
    this._symbol = `cf-${value}`;
  }
  get symbol(): string {
    return this._symbol;
  }

}
