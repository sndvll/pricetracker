import {Injectable} from '@angular/core';
import {FiatRatesDbService} from './fiat-rates-db.service';
import {FreeCurrencyApiService} from '../api/free-currency-api.service';
import {DateUtils} from '../utils';
import {CurrencyModel} from './interfaces';
import {catchError, map, switchMap} from 'rxjs/operators';
import {NEVER, Observable, Subject} from 'rxjs';
import {FiatCurrencyResponse} from '../api/api-response.interfaces';

@Injectable({providedIn: 'root'})
export class FiatCurrencyService {

  private _currentRates: Subject<CurrencyModel> = new Subject<CurrencyModel>();
  public currentRates = this._currentRates.asObservable();
  public availableCurrencies = this._currentRates.asObservable()
    .pipe(map(currency => Object.keys(currency.currencies)));

  baseCurrency = 'USD';

  constructor(
    private db: FiatRatesDbService,
    private api: FreeCurrencyApiService) {
    this.db.exists(DateUtils.today(), this.baseCurrency)
      .pipe(switchMap(exists => {
        if(!exists) {
          return this.loadFiatRates(this.baseCurrency);
        }
        console.log(`Fetching fiat rates from db`);
        return this.db.find(DateUtils.today());
      }))
      .subscribe(currency => this._currentRates.next(currency));
  }

  public loadFiatRates(baseCurrency: string, date = DateUtils.today()): Observable<CurrencyModel> {
    console.log(`Fetching fiat rates, base: ${baseCurrency}, date: ${date}`);
    return this.api.getCurrencies(date, baseCurrency)
      .pipe(catchError((err) => {
        return this._handleError(err, baseCurrency, date);
      }))
      .pipe(switchMap(res => {
        console.log(res);
        const data = res.data;
        // The reason for this responseDate is because the api
        // can response with yesterdays-date, but to keep things sane
        // the key to lookup in the database should be today, when things got fetched.
        const dates = Object.keys(data);
        const responseDate = dates[dates.length - 1];
        const currencyModel: CurrencyModel = {
          baseCurrency,
          currencies: data[responseDate]
        }
        return this.db.create(currencyModel, date);
      }));
  }



  private _handleError(error: any, baseCurrency: string, date: string): Observable<FiatCurrencyResponse> {
    console.log('Caught error fetching fiat rates', error.error.data.error);
    if (error.error.data.error === 'no data available for this date.') {
      console.log('No data available for this date. Fetching some historic data and taking the last day available');
      const fromDate = DateUtils.daysAgo(date, 7);
      const toDate = DateUtils.today();
      return this.api.getHistoric(fromDate, toDate, baseCurrency);
    }
    return NEVER;
  }
}
