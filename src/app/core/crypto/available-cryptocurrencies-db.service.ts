import {Injectable} from '@angular/core';
import {AbstractDbService} from '../persistence/abstract-db.service';
import {AppConfig} from '../../../app.config';
import {DexieService} from '../persistence/dexie.service';
import {from, Observable} from 'rxjs';
import {AvailableCryptoCurrency} from './interfaces';

export type AvailableSearchQuery = Partial<AvailableCryptoCurrency>;

@Injectable({providedIn: 'root'})
export class AvailableCryptocurrenciesDbService extends AbstractDbService<AvailableCryptoCurrency> {

  constructor(private dexieService: DexieService) {
    super(dexieService.table<AvailableCryptoCurrency>(AppConfig.tables.available_crypto));
  }

  public bulkAdd(coins: AvailableCryptoCurrency[]) {
    console.log(`Adding ${coins.length} into database`);
    this.table.bulkAdd(coins);
  }

  public search(phrase: string, key: string, limit: number | null) {
    if (limit) {
      return from(this.table
        .where(key)
        .startsWithAnyOfIgnoreCase(phrase)
        .limit(limit)
        .sortBy(key)
      );
    }
    return from(this.table
      .where(key)
      .startsWithAnyOfIgnoreCase(phrase)
      .sortBy(key)
    );
  }

  public findBySymbol(symbol: string): Observable<AvailableCryptoCurrency | undefined> {
    return from(this.table.where('symbol').equals(symbol).first());
  }

}
