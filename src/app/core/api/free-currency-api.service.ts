import {Injectable} from '@angular/core';
import {ApiKeys} from '../../../api-keys';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FiatCurrencyResponse} from './api-response.interfaces';

const ApiSettings = {
  key: ApiKeys.FREE_CURRENCY_API,
  url: 'https://freecurrencyapi.net/api/v1/rates'
}

@Injectable({providedIn: 'root'})
export class FreeCurrencyApiService {

  constructor(private http: HttpClient) {}

  public getCurrencies(date: string, baseCurrency: string): Observable<FiatCurrencyResponse> {
    return this.http.get<FiatCurrencyResponse>(`${ApiSettings.url}?apikey=${ApiSettings.key}&base_currency=${baseCurrency}&date_from=${date}`);
  }

  public getHistoric(fromDate: string, toDate: string, baseCurrency: string): Observable<FiatCurrencyResponse> {
    return this.http.get<FiatCurrencyResponse>(`${ApiSettings.url}?apikey=${ApiSettings.key}&base_currency=${baseCurrency}&date_from=${fromDate}&date_to=${toDate}`);

  }

}
