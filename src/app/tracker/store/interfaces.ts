export interface Asset {
  name: string;
  shortName: string;
  quantity: number;
  rate: number;
  change: number
}

export interface AssetState {
  assets: Asset[];
}



