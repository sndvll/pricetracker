import {AssetList, AssetModel, AssetPrice, IPriceTrackerStore} from '../model';
import {createSelector} from '@ngrx/store';

export const selectLists = ({priceTrackerState}: IPriceTrackerStore) => priceTrackerState.lists;

export const selectAllAssets = createSelector(
  selectLists,
  (lists: AssetList[]) => lists.reduce((acc: AssetModel[], current: AssetList) => {
    acc.push(...current.assets);
    return acc;
  }, [])
);

export const selectAllAssetIds = createSelector(
  selectAllAssets,
  (assets: AssetModel[]) => assets.map(asset => asset.id)
)

export const selectPrices = createSelector(
  selectAllAssets,
  assets => assets.map(asset => asset.price)
);

export const selectTotalAmount = createSelector(
  selectAllAssets,
  selectPrices,
  (assets: AssetModel[], prices: AssetPrice[]) =>
    assets.reduce((value: number, current: AssetModel): number =>
      getCurrentPrice(current.id, prices) * current.quantity + value, 0)
);

export const selectTotalAverageMarketChangePercentage = createSelector(
  selectAllAssets,
  selectPrices,
  (assets: AssetModel[], prices: AssetPrice[]) => {
    const sum = assets.reduce((value: number, current: AssetModel) =>
      value + getCurrentPriceChangePercentage(current.id, prices), 0);
    return sum / assets.length;
  }
);

const getCurrentPriceChangePercentage = (id: string, prices: AssetPrice[]): number => {
  return prices.find(price => price.id === id)?.price_change_percentage_24h || 0;
}

const getCurrentPrice = (id: string, prices: AssetPrice[]): number => {
  return prices.find(price => price.id === id)?.current_price || 0;
}
