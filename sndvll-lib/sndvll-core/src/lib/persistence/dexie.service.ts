import {Inject, Injectable} from '@angular/core';
import Dexie from 'dexie';
import {PERSISTENCE_CONFIG_INJECTION_TOKEN, PersistenceConfig} from "./persistence.config";
import {PersistenceModule} from "./persistence.module";

@Injectable({
  providedIn: PersistenceModule
})
export class DexieService {
  private _dexie: Dexie;
  constructor(@Inject(PERSISTENCE_CONFIG_INJECTION_TOKEN) config: PersistenceConfig) {
    this._dexie = new Dexie(config.database);
    this._dexie.version(1).stores(config.schema);
  }

  public table<T>(table: string) {
    return this._dexie.table<T, string>(table);
  }
}
