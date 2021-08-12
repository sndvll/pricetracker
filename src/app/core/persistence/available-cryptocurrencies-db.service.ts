import {Injectable} from '@angular/core';
import {AbstractDbService} from './abstract-db.service';
import {AppConfig} from '../../../app.config';
import {DexieService} from './dexie.service';
import {from} from 'rxjs';
import {AvailableCryptoCurrency} from '../model';
import {map, take} from 'rxjs/operators';

export type AvailableSearchQuery = Partial<AvailableCryptoCurrency>;

@Injectable({providedIn: 'root'})
export class AvailableCryptocurrenciesDbService extends AbstractDbService<AvailableCryptoCurrency> {

  constructor(private dexieService: DexieService) {
    super(dexieService.table<AvailableCryptoCurrency>(AppConfig.tables.available_crypto));
  }

  public search(phrase: string, limit: number) {
    const searchPhraseLowerCase = phrase.toLowerCase();
    return from(this.table.toArray())
      .pipe(
        take(1),
        map(result => result
          .map(entry => {
            let points = 0;
            if (entry.name.toLowerCase() === searchPhraseLowerCase) {
              points += 3;
            }
            if (entry.symbol.toLowerCase() === searchPhraseLowerCase) {
              points += 3;
            }
            if (entry.symbol.toLowerCase().startsWith(searchPhraseLowerCase)) {
              points += 2;
            }
            if (entry.name.toLowerCase().startsWith(searchPhraseLowerCase)) {
              points += 2;
            }
            if (entry.name.toLowerCase().includes(searchPhraseLowerCase)) {
              points += 1;
            }
            if (entry.symbol.toLowerCase().includes(searchPhraseLowerCase)) {
              points += 1;
            }
            if (!entry.name.toLowerCase().includes(searchPhraseLowerCase)) {
              points -= -1;
            }
            if (!entry.symbol.toLowerCase().includes(searchPhraseLowerCase)) {
              points -= 1;
            }
            return { entry, points };
          })
          .filter(entry => !!entry.points)
          .sort((a, b) => b.points - a.points)
          .map(({entry}) => entry)
          .slice(0, limit))
      );
  }

}
