import {Component, HostBinding, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Color, Colors} from '@sndvll/core';
import {IconsModule} from '../../shared';

@Component({
    selector: 'asset-icon',
    template: `<i class="cf {{symbol}}"></i>`,
    standalone: true,
    imports: [CommonModule, IconsModule]
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
