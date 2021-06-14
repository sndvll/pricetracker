import {Component, HostBinding, Input} from '@angular/core';
import {Asset} from '../../store';
import {Color} from '../../core/utils';

@Component({
  selector: 'asset-header',
  templateUrl: './asset-header.component.html'
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
