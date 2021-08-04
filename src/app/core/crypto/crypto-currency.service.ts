import {Injectable} from '@angular/core';
import {CoinGeckoApiService} from '../api/coingecko-api.service';
import {filter, map} from 'rxjs/operators';
import {AvailableCryptocurrenciesDbService} from '../persistence';
import {AvailableCryptoCurrency} from '../model';


@Injectable({providedIn: 'root'})
export class CryptoCurrencyService {

  public count = 0;

  constructor(private api: CoinGeckoApiService,
              private available: AvailableCryptocurrenciesDbService) {
    this._init();
  }

  private _init() {
    this.available.count()
      .pipe(
        filter(count => {
          console.log(`Found ${count} coins in db`);
          this.count = count;
          return count === 0;
        })
      )
      .subscribe(() => this.loadAvailableCurrencies());
  }

  public loadAvailableCurrencies() {
    console.log('loading coins into db');
    this.api.coins()
      .pipe(
        map(coins => {
          const filtered = coins.filter(coin => !!coin.id);
          this.count = filtered.length;
          return filtered;
        })
      )
      .subscribe(coins => this.available.bulkAdd(coins))
  }

  public search(phrase: string, key: string, limit: number | null = 20) {
    return this.available.search(phrase, key, limit);
  }

  public fetchDetails(id: string) {
    return this.api.coinDetails(id);
  }

  public getMarketDataForCoins(ids: string[], baseCurrency: string) {
    return this.api.markets(ids, baseCurrency);
  }

  public chartData(currency: AvailableCryptoCurrency, counterCurrency: string, days: number, daily?: boolean) {
    return this.api.coinChartData(currency.id, counterCurrency, days, daily)
      .pipe(map(chartData => ({
          marketCap: this._mapChartData(chartData.market_caps),
          price: this._mapChartData(chartData.prices),
          volume: this._mapChartData(chartData.total_volumes),
        })
      ));
  }

  private _mapChartData(data: number[][]) {
    return data.map((values: number[]) => ({
      name: new Date(values[0]),
      value: values[1]
    }))
  }
}
