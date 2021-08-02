import {Color} from '../core';
import {CoinGeckoMarketDataResponse} from '../core/api/api-response.interfaces';

export enum AssetsType {
  Crypto = 'crypto'
}

export interface AssetList {
  id: string;
  type: AssetsType,
  name: string;
  assets: AssetModel[];
}
export type AssetListModel = Omit<AssetList, 'assets'>


export interface AppState {
  lists: AssetList[];
  prices: AssetPrice[];
}

export interface AssetPrice extends CoinGeckoMarketDataResponse {}

export interface AssetModel {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  color: Color;
  list: string;
}
