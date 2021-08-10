import {AssetList, PriceTrackerState} from '../model';
import {Action, createReducer, on} from '@ngrx/store';
import {PriceTrackerActions} from './price-tracker.actions';
import {FiatCurrencyService} from '../fiat';

const initState = (): PriceTrackerState => ({
  lists: [],
  isLoading: true,
  displayCurrency: FiatCurrencyService.DisplayCurrency
});

const commonDoneReducer = (state: PriceTrackerState, {lists}: {lists: AssetList[]}) => ({...state, lists, isLoading: false});
const commonStartedReducer = (state: PriceTrackerState) => ({...state, isLoading: true});
const changeDisplayCurrencyReducer = (state: PriceTrackerState, {currency}: {currency: string}) => {
  FiatCurrencyService.DisplayCurrency = currency;
  return {...state, displayCurrency: currency}
};

const reducer = createReducer(initState(),
  on(PriceTrackerActions.initializeDone, commonDoneReducer),
  on(PriceTrackerActions.refreshPrices, commonStartedReducer),
  on(PriceTrackerActions.refreshPricesDone, commonDoneReducer),
  on(PriceTrackerActions.refreshPricesCanceled, state =>
    ({...state, isLoading: false})),
  on(PriceTrackerActions.createNewList, commonStartedReducer),
  on(PriceTrackerActions.createNewListDone, (state, {list}) =>
    ({...state, isLoading: false, lists: [...state.lists, list]})),
  on(PriceTrackerActions.addNewAsset, commonStartedReducer),
  on(PriceTrackerActions.addNewAssetDone, commonDoneReducer),
  on(PriceTrackerActions.editList, commonStartedReducer),
  on(PriceTrackerActions.editListDone, commonDoneReducer),
  on(PriceTrackerActions.deleteList, commonStartedReducer),
  on(PriceTrackerActions.deleteListDone,commonDoneReducer),
  on(PriceTrackerActions.editAsset, commonStartedReducer),
  on(PriceTrackerActions.editAssetDone, commonDoneReducer),
  on(PriceTrackerActions.deleteAsset, commonStartedReducer),
  on(PriceTrackerActions.deleteAssetDone, commonDoneReducer),
  on(PriceTrackerActions.changeDisplayCurrency, changeDisplayCurrencyReducer)
);


export function reducers(state: PriceTrackerState | undefined, action: Action): PriceTrackerState {
  return reducer(state, action);
}
