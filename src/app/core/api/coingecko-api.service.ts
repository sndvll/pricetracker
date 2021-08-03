import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  CoingeckoApiDetailsResponse, CoinGeckoChartDataResponse, CoinGeckoMarketDataResponse,
  CoinGeckoSimpleRateApiResponse
} from './api-response.interfaces';
import {AvailableCryptoCurrency} from '../crypto';

const ApiSettings = {
  url: 'https://api.coingecko.com/api/v3'
}

@Injectable({providedIn: 'root'})
export class CoinGeckoApiService {

  constructor(private http: HttpClient) {}

  public simple(coin: string, baseCurrency: string): Observable<CoinGeckoSimpleRateApiResponse> {
    return this.http.get<CoinGeckoSimpleRateApiResponse>(`${ApiSettings.url}/simple/price?ids=${coin}&vs_currencies=${baseCurrency}`);
  }

  markets(ids: string[], baseCurrency: string) {
    return this.http.get<CoinGeckoMarketDataResponse[]>(`${ApiSettings.url}/coins/markets?vs_currency=${baseCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=false&ids=${ids.toString()}&price_change_percentage=1h,24h,7d,14d,30d,200,1y`)
  }


  public coinDetails(id: string, marketData: boolean = true, tickers: boolean = false): Observable<CoingeckoApiDetailsResponse> {
    return this.http.get<CoingeckoApiDetailsResponse>(`${ApiSettings.url}/coins/${id}?localization=false&tickers=${tickers}&market_data=${marketData}&community_data=false&developer_data=false&sparkline=false`);
  }

  public coinChartData(id: string, counterCurrency: string, days: number, daily: boolean= true): Observable<CoinGeckoChartDataResponse> {
    return this.http.get<CoinGeckoChartDataResponse>(`${ApiSettings.url}/coins/${id}/market_chart?vs_currency=${counterCurrency}&days=${days}${daily ? '&interval=daily' : ''}`);
  }

  public coins(): Observable<AvailableCryptoCurrency[]> {
    return this.http.get<AvailableCryptoCurrency[]>(`${ApiSettings.url}/coins/list`);
  }
}
