import {Color} from '../utils';
import {CoinGeckoMarketDataResponse} from './api-response.interfaces';


export interface PriceTrackerState {
  lists: AssetList[];
  isLoading: boolean;
  displayCurrency: string
  error?: any;
}


export interface IPriceTrackerStore {
  priceTrackerState: PriceTrackerState;
}

export enum AssetsType {
  Crypto = 'crypto'
}

export interface AssetModel {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  color: Color;
  listId: string;
  price: AssetPrice;
}

export type NewAssetModel2 = Omit<AssetModel, 'listId' | 'price'>;
export interface AssetPrice extends Partial<CoinGeckoMarketDataResponse> {
  id: string;
}

export interface AssetList {
  id: string;
  type: AssetsType,
  name: string;
  assets: AssetModel[];
}
