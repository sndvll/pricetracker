import {Injectable} from '@angular/core';
import {CoinGeckoApiService} from '../api/coingecko-api.service';
import {
  AvailableCryptocurrenciesDbService,
} from './available-cryptocurrencies-db.service';
import {filter, map, tap} from 'rxjs/operators';


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

  public getBySymbol(symbol: string) {
    return this.available.findBySymbol(symbol);
  }
}
