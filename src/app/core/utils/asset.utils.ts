import {AssetModel, AssetPrice} from '../model';

const getCurrentPrice = (id: string, prices: AssetPrice[]): number => {
  return prices.find(price => price.id === id)?.current_price || 0;
}

const get24hPrice = (id: string, prices: AssetPrice[]): number => {
  const price = prices.find(price => price.id === id);
  return (price?.current_price || 0) - (price?.price_change_24h || 0);
}

const getPrices = (assets: AssetModel[]) => assets.map(asset => asset.price);

export const getTotalAmount = (assets: AssetModel[]): number => {
  const prices = getPrices(assets);
  return assets.reduce((value: number, current: AssetModel): number =>
    getCurrentPrice(current.id, prices) * current.quantity + value, 0);
}

export const getTotalAmount24h = (assets: AssetModel[]): number => {
  const prices = getPrices(assets);
  return assets.reduce((value: number, current: AssetModel): number =>
    get24hPrice(current.id, prices) * current.quantity + value, 0);
}

export const getTotalPriceChange = (assets: AssetModel[]): number => {
  const currentTotalAmount = getTotalAmount(assets);
  const totalAmount24h = getTotalAmount24h(assets);
  return ((currentTotalAmount - totalAmount24h) / totalAmount24h) * 100;
}
