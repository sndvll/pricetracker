import {Color} from '../core/utils';

export interface Asset {
  id: string;
  name: string;
  shortName: string;
  quantity: number;
  rate: number;
  marketChange: number
  color: Color;
}
export interface AssetList {
  id: string;
  name: string;
  assets: Asset[];
}

export interface AppState {
  lists: AssetList[];
}



