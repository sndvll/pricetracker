import {Injectable} from '@angular/core';
import {AppStore, AssetPrice} from '../store';
import {interval, Subject, Subscription} from 'rxjs';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import {CryptoCurrencyService} from '../core';
import {PriceDbService} from './price-db.service';

@Injectable({providedIn: 'root'})
export class PriceService {

  private _onStop: Subject<void> = new Subject();
  private _interval!: Subscription;

  constructor(private store: AppStore,
              private priceDb: PriceDbService,
              private crypto: CryptoCurrencyService) {}

  public start() {
    if (this._interval) {
      this.stop();
    }
    this._interval = interval(2000)
      .pipe(
        takeUntil(this._onStop),
        switchMap(() => this.store.selectAllAssetIds),
        filter(assetIds => !!assetIds.length),
        switchMap( (ids: string[]) =>
          this.crypto.pollPrice(ids, 'usd')))
      .subscribe((pricesResponse: AssetPrice[]) => {
        this.store.updatePrices(pricesResponse);
        this.priceDb.bulkAdd(pricesResponse);
      });
  }

  public stop() {
    this._onStop.next();
  }
}
