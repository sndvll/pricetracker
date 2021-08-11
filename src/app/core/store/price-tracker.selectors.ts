import {AssetList, AssetModel, IPriceTrackerStore} from '../model';
import {createSelector} from '@ngrx/store';
import {getTotalAmount, getTotalPriceChange} from '../utils';

export const selectState = ({priceTrackerState}: IPriceTrackerStore) => priceTrackerState;
export const selectLists = ({priceTrackerState}: IPriceTrackerStore) => priceTrackerState.lists;
export const selectIsLoading = ({priceTrackerState}: IPriceTrackerStore) => priceTrackerState.isLoading;
export const selectDisplayCurrency = ({priceTrackerState}: IPriceTrackerStore) => priceTrackerState.displayCurrency;
export const selectNumberOfLists = ({priceTrackerState}: IPriceTrackerStore) => priceTrackerState.lists.length;

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
  (assets: AssetModel[]) => getTotalAmount(assets)
);

export const selectTotalAverageMarketChangePercentage = createSelector(
  selectAllAssets,
  (assets: AssetModel[]) => getTotalPriceChange(assets)
);
