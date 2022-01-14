import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {CurrencyModel} from '../model';
import {AbstractDbService, DexieService} from '@sndvll/core';
import {PersistenceConfig} from '../../app.module';

@Injectable({providedIn: 'root'})
export class FiatRatesDbService extends AbstractDbService<CurrencyModel> {

  constructor(private dexieService: DexieService) {
    super(dexieService.table<CurrencyModel>(PersistenceConfig.tables.fiat_currency));
  }

  public exists(id: string, baseCurrency: string): Observable<boolean> {
    return from(this.find(id)).pipe(
      take(1),
      map(entry => !!entry && entry.baseCurrency === baseCurrency)
    )
  }
}
