import {Injectable} from '@angular/core';
import {CoinGeckoApiService} from '../api/coingecko-api.service';
import {
  AvailableCryptocurrenciesDbService,
} from './available-cryptocurrencies-db.service';
import {filter, tap} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class CryptoCurrencyService {

  constructor(private api: CoinGeckoApiService,
              private available: AvailableCryptocurrenciesDbService) {
    this._init();
  }

  private _init() {
    this.available.count()
      .pipe(
        tap(count => console.log(`Found ${count} coins in db`)),
        filter(count => count === 0)
      )
      .subscribe(() => this.loadAvailableCurrencies());
  }

  public loadAvailableCurrencies() {
    console.log('loading coins into db');
    this.api.coins()
      .subscribe(coins => this.available.bulkAdd(coins))
  }

  public search(phrase: string, key: string, limit: number | null = 20) {
    return this.available.search(phrase, key, limit);
  }

  public getBySymbol(symbol: string) {
    return this.available.findBySymbol(symbol);
  }
}
