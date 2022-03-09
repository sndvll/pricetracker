import {Injectable} from '@angular/core';
import {FiatRatesDbService} from '../persistence';
import {FreeCurrencyApiService} from '../api';
import {catchError, map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, NEVER, Observable, of, Subject} from 'rxjs';
import {FiatCurrencyResponse, CurrencyModel, Currencies} from '../model';
import {DateUtils} from '@sndvll/core';

@Injectable({providedIn: 'root'})
export class FiatCurrencyService {

  private _currentRates: Subject<CurrencyModel | null> = new BehaviorSubject<CurrencyModel | null>(null);
  public currentRates = this._currentRates.asObservable();
  public availableCurrencies = this._currentRates.asObservable()
    .pipe(map(currency => Object.keys(currency!.currencies)));

  constructor(
    private db: FiatRatesDbService,
    private api: FreeCurrencyApiService) {
  }

  public init() {
    this.db.exists(DateUtils.today(), FiatCurrencyService.BaseCurrency)
      .pipe(switchMap(exists => {
        if (!exists) {
          return this.loadFiatRates(FiatCurrencyService.BaseCurrency);
        }
        console.log(`Fetching fiat rates from db`);
        return this.db.find(DateUtils.today());
      }))
      .subscribe(currency => this._currentRates.next(currency!));
  }

  public loadFiatRates(baseCurrency: string, date = DateUtils.today()): Observable<CurrencyModel> {
    console.log(`Fetching fiat rates, base: ${baseCurrency}, date: ${date}`);
    return this.api.getCurrencies(baseCurrency)
      .pipe(
        catchError((err) => this._handleError(err)),
        switchMap(res => {
          const currencies = Object.values(res.data)
            .reduce((acc: Currencies, current) => {
              acc[current.code] = current.value;
              return acc;
            }, {});
          const currencyModel: CurrencyModel = this.filterOutNonRelevantCurrencies({
            baseCurrency,
            currencies
          });
          this.db.create(currencyModel, date);
          return of(currencyModel);
        }));
  }

  private _handleError(error: any): Observable<FiatCurrencyResponse> {
    console.log('Caught error fetching fiat rates', error);
    // todo handle this error, maybe get the latest rates in the db???
    return NEVER;
  }

  public getConvertedRateBySelectedCurrency(usdAmount: number, currency: string): Observable<number> {
    return this.currentRates.pipe(
      map(currentRates => (currentRates?.currencies[currency] || 1) * usdAmount)
    );
  }

  public static get BaseCurrency(): string {
    return 'USD';
  }

  public static get DisplayCurrency() {
    return localStorage.getItem('displayCurrency') || FiatCurrencyService.BaseCurrency;
  }
  public static set DisplayCurrency(currency: string) {
    localStorage.setItem('displayCurrency', currency);
  }

  private filterOutNonRelevantCurrencies(model: CurrencyModel): CurrencyModel {
    // these are irrelevant either because they are cryptocurrencies or
    // they are obsolete currencies that we are not interested in here.
    const crypto = [
      'XRP','LTC','ETH','BTC'
    ];
    const obsolete = [
      'BIH', 'BYR', 'HRV',
    ]
    const nonRelevant = [
      ...crypto, ...obsolete
    ];
    // and this became quite messy, but that's what you get with objects some times.
    const filteredCurrencies = Object.keys(model.currencies)
      .filter(symbol => !nonRelevant.includes(symbol))
      .reduce((acc: Currencies, symbol) => {
        acc[symbol] = model.currencies[symbol]
        return acc;
      }, {});

    return {baseCurrency: model.baseCurrency, currencies: filteredCurrencies};
  }
}
