import {Injectable, inject} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {AssetList, AssetModel, NewAssetModel2} from '../model';
import {PriceTrackerSignalStore} from './price-tracker-signal.store';

/**
 * Facade — same Observable API as before, backed by signalStore internally.
 * Components keep injecting this and subscribing via | async as before.
 */
@Injectable({providedIn: 'root'})
export class PriceTrackerStore {

  private signalStore = inject(PriceTrackerSignalStore);

  // ── Public Observables (bridged from signals) ─────────────────────────

  readonly lists$: Observable<AssetList[]>;
  readonly totalAmount$: Observable<number>;
  readonly totalAverageMarketChangePercentage$: Observable<number>;
  readonly isLoading$: Observable<boolean>;
  readonly displayCurrency$: Observable<string>;
  readonly numberOfLists$: Observable<number>;
  readonly state$: Observable<{lists: AssetList[]; isLoading: boolean; displayCurrency: string}>;

  constructor() {
    const s = this.signalStore;

    this.lists$ = toObservable(s.lists);
    this.isLoading$ = toObservable(s.isLoading);
    this.displayCurrency$ = toObservable(s.displayCurrency);
    this.totalAmount$ = toObservable(s.totalAmount);
    this.totalAverageMarketChangePercentage$ = toObservable(s.totalPriceChange);
    this.numberOfLists$ = toObservable(s.numberOfLists);

    this.state$ = toObservable(s.lists).pipe(
      map(() => ({
        lists: s.lists(),
        isLoading: s.isLoading(),
        displayCurrency: s.displayCurrency(),
      }))
    );
  }

  // ── Public Methods (delegated to signalStore) ─────────────────────────

  createNewList(name: string, asset: NewAssetModel2) {
    this.signalStore.createNewList(name, asset);
  }

  addNewAsset(listId: string, asset: NewAssetModel2) {
    this.signalStore.addNewAsset(listId, asset);
  }

  editList(name: string, id: string) {
    this.signalStore.editList(name, id);
  }

  editAsset(asset: AssetModel) {
    this.signalStore.editAsset(asset);
  }

  deleteAsset(id: string, listId: string) {
    this.signalStore.deleteAsset(id, listId);
  }

  deleteList(id: string) {
    this.signalStore.deleteList(id);
  }

  refreshPrices() {
    this.signalStore.refreshPrices();
  }

  startPricePolling() {
    this.signalStore.startPricePolling();
  }

  stopPricePolling() {
    this.signalStore.stopPricePolling();
  }

  changeDisplayCurrency(currency: string) {
    this.signalStore.changeDisplayCurrency(currency);
  }

  expandList(listId: string, expanded: boolean) {
    this.signalStore.expandList(listId, expanded);
  }

  reorder(lists: AssetList[]) {
    this.signalStore.reorderLists(lists);
  }

  reload() {
    this.signalStore.initialize();
  }
}
