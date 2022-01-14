import {Injectable} from '@angular/core';
import {AbstractDbService} from './abstract-db.service';
import {DexieService} from './dexie.service';
import {AppConfig} from '../../../app.config';
import {AssetList} from '../model';

@Injectable({providedIn: 'root'})
export class ListDbService extends AbstractDbService<AssetList>{
  constructor(private dexieService: DexieService) {
    super(dexieService.table<AssetList>(AppConfig.tables.lists));
  }
}
