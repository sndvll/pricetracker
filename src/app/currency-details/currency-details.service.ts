import {Injectable} from '@angular/core';
import {AvailableCryptoCurrency} from '../core';
import {CurrencyDetailsComponent} from './components';
import {GlobalOverlayConfigBuilder, OverlayService} from '@sndvll/core';

@Injectable({providedIn: 'root'})
export class CurrencyDetailsService {

  constructor(private dialog: OverlayService) {}

  public open(currency: AvailableCryptoCurrency) {
    const dialogConfig = GlobalOverlayConfigBuilder
      .full<CurrencyDetailsComponent, AvailableCryptoCurrency>(CurrencyDetailsComponent)
      .withBackdrop(false)
      .data(currency)
      .config;

    return this.dialog.open(dialogConfig);
  }
}
