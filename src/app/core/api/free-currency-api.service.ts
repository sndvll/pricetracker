import {Injectable} from '@angular/core';
import {ApiKeys} from '../../../api-keys';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FiatCurrencyResponse} from '../model';
import {tap} from 'rxjs/operators';

const ApiSettings = {
  key: ApiKeys.FREE_CURRENCY_API,
  baseUrl: 'https://api.currencyapi.com/v3'
}

@Injectable({providedIn: 'root'})
export class FreeCurrencyApiService {

  constructor(private http: HttpClient) {}

  public getCurrencies(baseCurrency: string): Observable<FiatCurrencyResponse> {
    return this.http.get<FiatCurrencyResponse>(`${ApiSettings.baseUrl}/latest?apikey=${ApiSettings.key}&base_currency=${baseCurrency}`)
      .pipe(tap(console.log));
  }
}
