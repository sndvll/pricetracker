import {Component, Input} from "@angular/core";

@Component({
  selector: 'asset',
  template: `
    <div class="asset bg-yellow-50">
      <div class="icon">
        <i [classList]="icon"></i>
      </div>
      <div class="flex flex-col">
        <span class="text-xl subpixel-antialiased">{{shortName}}</span>
        <span class="text-xs">{{name}}</span>
      </div>
      <div class="text-lg text-right">
        {{rate | currency}}
      </div>
      <div class="text-lg text-right">
        {{quantity}}
      </div>
      <div class="text-lg text-right">
        {{(quantity * rate) | currency}}
      </div>
    </div>
  `,
  styles: [`
    .icon {
      @apply w-14 h-14 flex items-center justify-center rounded-full bg-yellow-200 text-3xl subpixel-antialiased text-gray-600;
    }

    .asset {
      @apply grid grid-cols-5 mt-2 py-3 shadow-sm rounded px-3;
    }

  `]
})
export class AssetComponent {

  @Input() shortName!: string;
  @Input() name!: string;
  @Input() quantity!: number;
  @Input() rate!: number;

  get icon(): string {
    return 'cf cf-' + this.shortName.toLowerCase();
  }

}
