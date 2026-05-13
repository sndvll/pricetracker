import {InjectionToken} from "@angular/core";

export interface PersistenceConfig {
  database: string;
  tables: {[keys: string]: string},
  schema: {[keys: string]: string}
}

export const PERSISTENCE_CONFIG_INJECTION_TOKEN = new InjectionToken<PersistenceConfig>('persistence_config');
