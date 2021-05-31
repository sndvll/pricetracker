import {Component, Input} from "@angular/core";

@Component({
  selector: 'asset',
  template: `
    <div class="asset bg-yellow-50">
      <div class="icon">
        <i [classList]="icon"></i>
      </div>
      <div class="flex flex-col justify-center">
        <span class="text-xl font-bold subpixel-antialiased">{{shortName | uppercase}}</span>
        <span class="text-xs">{{name}}</span>
      </div>
      <div class="text-left flex flex-col justify-center">
       <span class="text-base">{{rate | currency}}</span>
       <span class="text-sm"
             [class.text-red-500]="negativeChange"
             [class.text-green-500]="!negativeChange">{{!negativeChange ? '+' : ''}}{{change}}%</span>
      </div>
      <div class="text-lg text-right flex flex-col col-span-4 justify-center">
        <span class="text-2xl subpixel-antialiased">{{(quantity * rate) | currency : 'USD' }}</span>
        <span class="text-sm">{{quantity | number : '1.2-6'}}</span>
      </div>
    </div>
  `,
  styles: [`
    .icon {
      @apply w-14 h-14 flex items-center justify-center rounded-full bg-yellow-200 text-3xl subpixel-antialiased text-gray-600;
    }

    .asset {
      @apply grid grid-cols-7 mt-2 py-3 shadow-sm rounded px-3;
    }
  `]
})
export class AssetComponent {

  @Input() shortName!: string;
  @Input() name!: string;
  @Input() quantity!: number;
  @Input() rate!: number;
  @Input() change!: number;

  get icon(): string {
    return `cf cf-${this.shortName.toLowerCase()}`;
  }

  get negativeChange(): boolean {
    return this.change < 0;
  }

}
