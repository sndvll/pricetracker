import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CoinGeckoRateApiResponse, CoinGeckoSimpleRateApiResponse} from './api-response.interfaces';

const ApiSettings = {
  url: 'https://api.coingecko.com/api/v3'
}

@Injectable({providedIn: 'root'})
export class CoinGeckoApiService {

  constructor(private http: HttpClient) {}

  public simple(coin: string, baseCurrency: string): Observable<CoinGeckoSimpleRateApiResponse> {
    return this.http.get<CoinGeckoSimpleRateApiResponse>(`${ApiSettings.url}/simple/price?ids=${coin}&vs_currencies=${baseCurrency}`);
  }

  public coin(id: string): Observable<CoinGeckoRateApiResponse> {
    return this.http.get<CoinGeckoRateApiResponse>(`${ApiSettings.url}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
  }

  public coins(): Observable<any[]> {
    return this.http.get<any[]>(`${ApiSettings.url}/coins/list`);
  }
}
