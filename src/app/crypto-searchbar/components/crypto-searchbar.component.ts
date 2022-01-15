import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {
  AvailableCryptoCurrency,
  CryptoCurrencyService,
} from '../../core';
import {SearchComponent, SearchStatus} from '@sndvll/components';

@Component({
  selector: 'crypto-searchbar',
  templateUrl: './crypto-searchbar.component.html'
})
export class CryptoSearchbarComponent {

  @ViewChild(SearchComponent) search!: SearchComponent;

  @Output() openCurrencyDetails = new EventEmitter<AvailableCryptoCurrency>();
  @Output() addCurrency = new EventEmitter<AvailableCryptoCurrency>();

  public searchStatus: SearchStatus = null;
  public searchResult: AvailableCryptoCurrency[] = [];

  constructor(private crypto: CryptoCurrencyService) {}

  public onSearch(searchPhrase: string) {
    if (searchPhrase) {
      this.crypto.search(searchPhrase, 75)
        .subscribe(searchResult => {
          this.searchStatus = searchResult.length ? 'result' : 'noresult';
          this.searchResult = searchResult;
        });
    } else {
      this.searchResult = [];
      this.searchStatus = null;
      this.search.close();
    }
  }

  public onOpenCurrencyDetails(currency: AvailableCryptoCurrency) {
    this.openCurrencyDetails.emit(currency);
    this.search.clear();
    this.search.close();
  }

  public add(currency: AvailableCryptoCurrency) {
    this.addCurrency.emit(currency);
    this.search.clear();
    this.search.close();
  }

  get count() {
    return this.crypto.count;
  }

  public reloadCurrencyDatabase() {
    this.crypto.loadAvailableCurrencies(true);
    this.search.close();
  }

}
