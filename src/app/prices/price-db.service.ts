import {Injectable} from '@angular/core';
import {AbstractDbService} from '../core/persistence/abstract-db.service';
import {AssetPrice} from '../store';
import {DexieService} from '../core/persistence/dexie.service';
import {AppConfig} from '../../app.config';

@Injectable({providedIn: 'root'})
export class PriceDbService extends AbstractDbService<AssetPrice>{
  constructor(private dexieService: DexieService) {
    super(dexieService.table<AssetPrice>(AppConfig.tables.asset_price));
  }
}
