import {Component, HostBinding, Input} from '@angular/core';
import {Asset} from '../../store';
import {Color} from '../../core/utils';

@Component({
  selector: 'asset-header',
  template: `
    <div class="flex items-center justify-start">
      <asset-icon [shortName]="asset.shortname"
                  class="{{iconTextColor}} {{iconBgColor}}"></asset-icon>
    </div>

    <div class="grid grid-2 grid-flow-row col-span-4">
      <div class="grid grid-2 grid-flow-col">
        <span class="text-lg font-bold">{{asset.shortname | uppercase}}</span>
        <span class="text-lg text-right">{{asset.rate | currency}}</span>
      </div>
      <div class="grid grid-2 grid-flow-col">
        <div class="text-xs">{{asset.name}}</div>
        <div class="text-xs font-bold text-right"
             [class.text-red-500]="negativeChange"
             [class.text-green-500]="!negativeChange">
          {{asset.marketChange | change}}
        </div>
      </div>
    </div>
    <div class="pl-2 break-all text-right flex flex-col col-span-2">
      <span class="text-sm">{{asset.quantity | number : '1.2-6'}}</span>
    </div>
  `
})
export class AssetHeaderComponent {

  @HostBinding('class') classList = 'grid grid-cols-7 grid-flow-col auto-cols-min';

  @Input() asset!: Asset;

  get negativeChange(): boolean {
    return this.asset.marketChange < 0;
  }

  get iconTextColor() {
    if (this.asset.color === Color.white) {
      return `text-black dark:text-black`;
    }
    if (this.asset.color === Color.black) {
      return `text-white dark:text-white`;
    }
    return `text-gray-600 dark:text-gray-100`;
  }



  get iconBgColor() {
    return this.asset.color === Color.white ||
      this.asset.color === Color.black ?
      `bg-${this.asset.color} dark:bg-${this.asset.color}` :
      `bg-${this.asset.color}-300 dark:bg-${this.asset.color}-400`;
  }
}
