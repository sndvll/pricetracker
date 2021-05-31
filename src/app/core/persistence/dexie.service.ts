import {Injectable} from '@angular/core';
import Dexie from 'dexie';
import {AppConfig} from '../../../app.config';

@Injectable({providedIn: 'root'})
export class DexieService {
  private _dexie: Dexie;
  constructor() {
    this._dexie = new Dexie(AppConfig.database);
    this._dexie.version(1).stores(AppConfig.schema);
  }

  public table<T>(table: string) {
    return this._dexie.table<T, string>(table);
  }
}
