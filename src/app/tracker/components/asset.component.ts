import {Component, HostBinding, Input} from "@angular/core";
import {Color} from '../../core/utils';

@Component({
  selector: 'asset',
  template: `
    <div class="flex items-center justify-center">
      <asset-icon [shortName]="shortName" class="text-gray-600 dark:text-gray-100 bg-{{color}}-300 dark:bg-{{color}}-400"></asset-icon>
    </div>
    <div class="flex flex-col justify-center ml-2">
      <span class="text-lg font-bold">{{shortName | uppercase}}</span>
      <span class="truncate text-xs">{{name}}</span>
    </div>
    <div class="pl-2 break-all text-right flex flex-col col-span-3 justify-center">
      <span class="text-sm">{{rate | currency}}</span>
      <span class="text-xs font-bold"
            [class.text-red-500]="negativeChange"
            [class.text-green-500]="!negativeChange">
        {{marketChange | change}}
      </span>
    </div>
    <div class="pl-2 break-all text-right flex flex-col col-span-2 justify-center">
      <span class="text-sm">{{quantity | number : '1.2-6'}}</span>
    </div>
  `
})
export class AssetComponent {

  @HostBinding('class') classList = 'px-1 py-1 grid grid-cols-7 grid-flow-col auto-cols-min rounded select-none';

  @Input() shortName!: string;
  @Input() name!: string;
  @Input() quantity!: number;
  @Input() rate!: number;
  @Input() marketChange!: number;
  @Input() color!: Color;

  get negativeChange(): boolean {
    return this.marketChange < 0;
  }

}
