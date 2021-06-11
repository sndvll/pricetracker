import {InjectionToken} from '@angular/core';

export interface StateConfig {
  enableDevTools: boolean;
}

export interface StoreConfig extends StateConfig {
  storeName?: string;
}

export const STORE_CONFIG = new InjectionToken<StateConfig>('STORE_CONFIG');
