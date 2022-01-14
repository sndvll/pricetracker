import {
  Component,
  HostBinding,
  Input
} from '@angular/core';
import {AssetModel, FiatCurrencyService} from '../../core';
import {Observable} from 'rxjs';
import {Color} from '@sndvll/core';

@Component({
  selector: 'asset-header',
  templateUrl: './asset-header.component.html',
})
export class AssetHeaderComponent {

  @HostBinding('class') classList = 'grid grid-cols-7 grid-flow-col auto-cols-min';

  @Input() asset!: AssetModel;

  @Input() displayCurrency!: string;
  @Input() currentLanguage!: string;

  constructor(private fiat: FiatCurrencyService) {}

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

  get rate(): Observable<number> {
    return this.fiat.getConvertedRateBySelectedCurrency(this.asset.price.current_price!, this.displayCurrency);
  }

  get marketChange(): number {
    return this.asset.price.price_change_percentage_24h || 0;
  }

  get negativeChange(): boolean{
    return this.marketChange < 0;
  }
}
