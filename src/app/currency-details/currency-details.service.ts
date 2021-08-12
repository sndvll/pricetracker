import {Injectable} from '@angular/core';
import {AvailableCryptoCurrency, DialogService, GlobalDialogConfigBuilder} from '../core';
import {CurrencyDetailsComponent} from './components';

@Injectable({providedIn: 'root'})
export class CurrencyDetailsService {

  constructor(private dialog: DialogService) {}

  public open(currency: AvailableCryptoCurrency) {
    const dialogConfig = GlobalDialogConfigBuilder
      .full<CurrencyDetailsComponent, AvailableCryptoCurrency>(CurrencyDetailsComponent)
      .withBackdrop(false)
      .data(currency)
      .config;

    return this.dialog.open(dialogConfig);
  }
}
