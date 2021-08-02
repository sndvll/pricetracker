import {Injectable} from '@angular/core';
import {AvailableCryptoCurrency, DialogService, GlobalDialogConfigBuilder} from '../core';
import {CurrencyDetailsComponent} from './currency-details.component';

@Injectable({providedIn: 'root'})
export class CurrencyDetailsService {

  constructor(private dialog: DialogService) {}

  public open(currency: AvailableCryptoCurrency) {
    const dialogConfig = GlobalDialogConfigBuilder
      .full<CurrencyDetailsComponent, AvailableCryptoCurrency>(CurrencyDetailsComponent)
      .data(currency)
      .config;

    this.dialog.open(dialogConfig);
  }
}
