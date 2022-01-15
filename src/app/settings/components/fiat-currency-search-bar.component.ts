import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FiatCurrencyService} from '../../core';
import {TranslateService} from '@ngx-translate/core';
import {SearchComponent, SearchStatus} from '@sndvll/components';

@Component({
  selector: 'fiat-currency-search-bar',
  templateUrl: './fiat-currency-search-bar.component.html'
})
export class FiatCurrencySearchBarComponent implements OnInit {

  public currentDisplayCurrencyLabel: string = '';
  public searchStatus: SearchStatus = null;
  public searchResult: string[] = [];

  @Input() availableCurrencies: string[] = [];
  @Output() onSelect = new EventEmitter<string>();
  @ViewChild(SearchComponent) search!: SearchComponent;

  constructor(private translate: TranslateService,) {}

  ngOnInit() {
    this.currentDisplayCurrencyLabel = this.getPlaceholderString(FiatCurrencyService.DisplayCurrency);
  }

  public onSearch(searchPhrase: string) {
    if (searchPhrase) {
      this.searchResult = this.availableCurrencies.filter(symbol => symbol.toLowerCase().startsWith(searchPhrase.toLowerCase()));
      this.searchStatus = this.searchResult.length ? 'result' : 'noresult';
    }
    if (!searchPhrase.length) {
      this.search.close();
    }
  }

  public onSelectCurrency(currency: string) {
    this.search.close(this.getPlaceholderString(currency));
    if (currency && currency != FiatCurrencyService.DisplayCurrency) {
      this.onSelect.emit(currency);
    }
  }

  public getPlaceholderString(symbol: string) {
    return `${this.translate.instant(`CURRENCY.${symbol.toUpperCase()}`)} (${symbol.toUpperCase()})`
  }
}
