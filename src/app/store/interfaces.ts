import {Color} from '../core/utils';

export enum AssetsType {
  Crypto = 'crypto'
}

export interface Asset {
  id: string;
  name: string;
  shortname: string;
  quantity: number;
  rate: number;
  marketChange: number
  color: Color;
}
export interface AssetList {
  id: string;
  type: AssetsType,
  name: string;
  assets: Asset[];
}

export interface AppState {
  lists: AssetList[];
}

