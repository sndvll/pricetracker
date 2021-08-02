import {Injectable} from '@angular/core';
import {AbstractDbService} from '../core/persistence/abstract-db.service';
import {AssetListModel} from './interfaces';
import {DexieService} from '../core/persistence/dexie.service';
import {AppConfig} from '../../app.config';

@Injectable({providedIn: 'root'})
export class UserListDbService extends AbstractDbService<AssetListModel>{
  constructor(private dexieService: DexieService) {
    super(dexieService.table<AssetListModel>(AppConfig.tables.user_lists));
  }
}
