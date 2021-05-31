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
    this.table.bulkPut(coins);
  }

  public search(phrase: string, key: string) {
    return from(this.table.where(key).startsWithAnyOfIgnoreCase(phrase).toArray());
  }

  public findBySymbol(symbol: string): Observable<AvailableCryptoCurrency | undefined> {
    return from(this.table.where('symbol').equals(symbol).first());
  }

}
