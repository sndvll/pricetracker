import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AssetList, AssetModel, IPriceTrackerStore, NewAssetModel2, PriceTrackerState} from '../model';
import {Store} from '@ngrx/store';
import {
  selectLists,
  selectTotalAverageMarketChangePercentage,
  selectTotalAmount,
  selectIsLoading, selectDisplayCurrency, selectState
} from './price-tracker.selectors';
import {PriceTrackerActions} from './price-tracker.actions';

@Injectable({providedIn: 'root'})
export class PriceTrackerStore {

  public state$: Observable<PriceTrackerState>;
  public lists$: Observable<AssetList[]>;
  public totalAmount$: Observable<number>;
  public totalAverageMarketChangePercentage$: Observable<number>;
  public isLoading$: Observable<boolean>;
  public displayCurrency$: Observable<string>

  constructor(private store: Store<IPriceTrackerStore>) {
    this.state$ = this.store.select(selectState);
    this.lists$ = this.store.select(selectLists);
    this.totalAmount$ = this.store.select(selectTotalAmount);
    this.totalAverageMarketChangePercentage$ = this.store.select(selectTotalAverageMarketChangePercentage);
    this.isLoading$ = this.store.select(selectIsLoading);
    this.displayCurrency$ = this.store.select(selectDisplayCurrency);
    this.store.dispatch(PriceTrackerActions.initializeStarted());
  }

  public createNewList(name: string, asset: NewAssetModel2) {
    this.store.dispatch(PriceTrackerActions.createNewList({name, asset}));
  }

  public addNewAsset(listId: string, asset: NewAssetModel2) {
    this.store.dispatch(PriceTrackerActions.addNewAsset({listId, asset}));
  }

  public editList(name: string, id: string, order: number) {
    this.store.dispatch(PriceTrackerActions.editList({name, id, order}));
  }
  public editAsset(asset: AssetModel) {
    this.store.dispatch(PriceTrackerActions.editAsset({asset}));
  }
  public deleteAsset(id: string, listId: string) {
    this.store.dispatch(PriceTrackerActions.deleteAsset({id, listId}));
  }
  public deleteList(id: string) {
    this.store.dispatch(PriceTrackerActions.deleteList({id}));
  }

  public refreshPrices() {
    this.store.dispatch(PriceTrackerActions.refreshPrices());
  }

  public startPricePolling(){
    this.store.dispatch(PriceTrackerActions.startPricePolling());
  }
  public stopPricePolling() {
    this.store.dispatch(PriceTrackerActions.stopPricePolling());
  }

  public changeDisplayCurrency(currency: string) {
    this.store.dispatch(PriceTrackerActions.changeDisplayCurrency({currency}))
  }

  public expandList(listId: string, expanded: boolean) {
    this.store.dispatch(PriceTrackerActions.expandList({listId, expanded}))
  }
}

