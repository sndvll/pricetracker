import {AssetModel, AssetPrice} from '../model';

export const getCurrentPriceChangePercentage = (id: string, prices: AssetPrice[]): number => {
  return prices.find(price => price.id === id)?.price_change_percentage_24h || 0;
}

const getCurrentPrice = (id: string, prices: AssetPrice[]): number => {
  return prices.find(price => price.id === id)?.current_price || 0;
}

const getPrices = (assets: AssetModel[]) => assets.map(asset => asset.price);

export const getTotalAmount = (assets: AssetModel[]): number => {
  const prices = getPrices(assets);
  return assets.reduce((value: number, current: AssetModel): number =>
    getCurrentPrice(current.id, prices) * current.quantity + value, 0);
}

export const getTotalPriceChange = (assets: AssetModel[]): number => {
  const prices = getPrices(assets);
  const sum = assets.reduce((value: number, current: AssetModel) =>
    value + getCurrentPriceChangePercentage(current.id, prices), 0);
  return sum / assets.length;
}
