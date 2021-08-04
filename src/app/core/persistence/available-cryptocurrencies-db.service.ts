import {Injectable} from '@angular/core';
import {AbstractDbService} from './abstract-db.service';
import {AppConfig} from '../../../app.config';
import {DexieService} from './dexie.service';
import {from} from 'rxjs';
import {AvailableCryptoCurrency} from '../model';

export type AvailableSearchQuery = Partial<AvailableCryptoCurrency>;

@Injectable({providedIn: 'root'})
export class AvailableCryptocurrenciesDbService extends AbstractDbService<AvailableCryptoCurrency> {

  constructor(private dexieService: DexieService) {
    super(dexieService.table<AvailableCryptoCurrency>(AppConfig.tables.available_crypto));
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

}
