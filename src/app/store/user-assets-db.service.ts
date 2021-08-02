import {Injectable} from '@angular/core';
import {AbstractDbService} from '../core/persistence/abstract-db.service';
import {AssetModel} from './interfaces';
import {DexieService} from '../core/persistence/dexie.service';
import {AppConfig} from '../../app.config';
import {from} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserAssetsDbService extends AbstractDbService<AssetModel>{
  constructor(private dexieService: DexieService) {
    super(dexieService.table<AssetModel>(AppConfig.tables.user_assets));
  }

  findAllByListId(listId: string) {
    return from(this.table.where('list').equals(listId).toArray());
  }

  deleteWhereListId(listId: string) {
    this.table.where('list').equals(listId).delete();
  }
}
