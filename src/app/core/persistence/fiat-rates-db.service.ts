import {Injectable} from '@angular/core';
import {AbstractDbService} from './abstract-db.service';
import {AppConfig} from '../../../app.config';
import {from, Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {DexieService} from './dexie.service';
import {CurrencyModel} from '../model';

@Injectable({providedIn: 'root'})
export class FiatRatesDbService extends AbstractDbService<CurrencyModel> {

  constructor(private dexieService: DexieService) {
    super(dexieService.table<CurrencyModel>(AppConfig.tables.fiat_currency));
  }

  public exists(id: string, baseCurrency: string): Observable<boolean> {
    return from(this.find(id)).pipe(
      take(1),
      map(entry => !!entry && entry.baseCurrency === baseCurrency)
    )
  }
}
