import {Injectable} from '@angular/core';
import {AssetList} from '../model';
import {AbstractDbService, DexieService} from '@sndvll/core';
import {PersistenceConfig} from '../../app.module';

@Injectable({providedIn: 'root'})
export class ListDbService extends AbstractDbService<AssetList>{
  constructor(private dexieService: DexieService) {
    super(dexieService.table<AssetList>(PersistenceConfig.tables.lists));
  }
}
