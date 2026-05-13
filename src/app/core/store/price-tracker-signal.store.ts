import {signalStore, withState, withComputed, withMethods, withHooks, patchState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {computed, inject} from '@angular/core';
import {pipe, switchMap, tap, of, Subscription, interval} from 'rxjs';
import * as shortid from 'shortid';

import {ListDbService} from '../persistence';
import {CryptoCurrencyService} from '../crypto';
import {FiatCurrencyService} from '../fiat';
import {getTotalAmount, getTotalPriceChange} from '../utils';
import {AssetList, AssetModel, AssetPrice, AssetsType, NewAssetModel2} from '../model';

// ─── State ───────────────────────────────────────────────────────────────

export interface PriceTrackerState {
  lists: AssetList[];
  isLoading: boolean;
  displayCurrency: string;
}

const initialState: PriceTrackerState = {
  lists: [],
  isLoading: true,
  displayCurrency: FiatCurrencyService.DisplayCurrency
};

// ─── Signal Store ────────────────────────────────────────────────────────

export const PriceTrackerSignalStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),

  // ── Computed (selectors) ─────────────────────────────────────────────
  withComputed((store) => {
    const allAssets = computed(() =>
      store.lists().reduce((acc: AssetModel[], list) => {
        acc.push(...list.assets);
        return acc;
      }, [])
    );

    return {
      numberOfLists: computed(() => store.lists().length),
      allAssets,
      allAssetIds: computed(() => {
        const ids = new Set<string>();
        for (const list of store.lists()) {
          for (const asset of list.assets) {
            ids.add(asset.id);
          }
        }
        return Array.from(ids);
      }),
      totalAmount: computed(() => getTotalAmount(allAssets())),
      totalPriceChange: computed(() => getTotalPriceChange(allAssets())),
    };
  }),

  // ── Methods ──────────────────────────────────────────────────────────
  withMethods((store) => {
    const listDb = inject(ListDbService);
    const crypto = inject(CryptoCurrencyService);
    const fiat = inject(FiatCurrencyService);
    let pollingSub: Subscription | null = null;

    const baseCurrency = () => FiatCurrencyService.BaseCurrency;

    // ── Initialize ───────────────────────────────────────────────────
    const initialize = rxMethod<void>(
      pipe(
        switchMap(() => {
          fiat.init();
          return listDb.findAll().pipe(
            tap(lists => {
              patchState(store, {lists: lists || [], isLoading: false});
              if (lists && lists.length) {
                refreshPrices();
              }
            })
          );
        })
      )
    );

    // ── Refresh prices (API) ──────────────────────────────────────────
    const refreshPrices = rxMethod<void>(
      pipe(
        switchMap(() => {
          const assetIds = store.allAssetIds();
          if (!assetIds.length) return of(undefined);
          return crypto.getMarketDataForCoins(assetIds, baseCurrency()).pipe(
            tap((marketData: AssetPrice[]) => {
              const lists = store.lists();
              const updatedLists = lists.map(list => {
                const listAssetIds = new Set(list.assets.map(a => a.id));
                const newPrices = marketData.filter(p => listAssetIds.has(p.id));
                const newAssets = list.assets.map(asset => ({
                  ...asset,
                  price: newPrices.find(p => p.id === asset.id) || asset.price
                }));
                const changedList = {...list, assets: newAssets};
                listDb.update(changedList, changedList.id);
                return changedList;
              });
              patchState(store, {lists: updatedLists, isLoading: false});
            })
          );
        })
      )
    );

    return {
      // ── Expose reactive methods ────────────────────────────────────
      initialize,
      refreshPrices,

      // ── Price polling ──────────────────────────────────────────────
      startPricePolling() {
        if (!pollingSub) {
          pollingSub = interval(2000).subscribe(() => refreshPrices());
        }
      },
      stopPricePolling() {
        pollingSub?.unsubscribe();
        pollingSub = null;
      },

      // ── Create list ────────────────────────────────────────────────
      createNewList(name: string, asset: NewAssetModel2) {
        patchState(store, {isLoading: true});
        crypto.getMarketDataForCoins([asset.id], baseCurrency()).subscribe({
          next(marketData) {
            const price = marketData[0];
            if (!price) {
              patchState(store, {isLoading: false});
              return;
            }
            const id = shortid.generate();
            const list: AssetList = {
              name,
              id,
              type: AssetsType.Crypto,
              assets: [{...asset, listId: id, price}],
              expanded: true,
              order: store.lists().length + 1,
            };
            listDb.create(list);
            patchState(store, {lists: [...store.lists(), list], isLoading: false});
          },
          error() {
            patchState(store, {isLoading: false});
          }
        });
      },

      // ── Add asset to existing list ─────────────────────────────────
      addNewAsset(listId: string, asset: NewAssetModel2) {
        patchState(store, {isLoading: true});
        crypto.getMarketDataForCoins([asset.id], baseCurrency()).subscribe({
          next(marketData) {
            const price = marketData[0];
            if (!price) {
              patchState(store, {isLoading: false});
              return;
            }
            const lists = store.lists();
            const found = lists.find(l => l.id === listId);
            if (!found) {
              patchState(store, {isLoading: false});
              return;
            }
            const updatedList = {
              ...found,
              assets: [...found.assets, {...asset, price, listId}]
            };
            listDb.update(updatedList, updatedList.id);
            patchState(store, {
              lists: lists.map(l => l.id === listId ? updatedList : l),
              isLoading: false
            });
          },
          error() {
            patchState(store, {isLoading: false});
          }
        });
      },

      // ── Edit list name ─────────────────────────────────────────────
      editList(name: string, id: string) {
        const lists = store.lists();
        const found = lists.find(l => l.id === id);
        if (!found) return;
        const updated = {...found, name};
        listDb.update(updated, updated.id);
        patchState(store, {lists: lists.map(l => l.id === id ? updated : l)});
      },

      // ── Edit asset ─────────────────────────────────────────────────
      editAsset(asset: AssetModel) {
        const lists = store.lists();
        const foundList = lists.find(l => l.id === asset.listId);
        if (!foundList) return;
        const updatedList = {
          ...foundList,
          assets: foundList.assets.map(a => a.id === asset.id ? asset : a)
        };
        listDb.update(updatedList, updatedList.id);
        patchState(store, {lists: lists.map(l => l.id === asset.listId ? updatedList : l)});
      },

      // ── Delete list ────────────────────────────────────────────────
      deleteList(id: string) {
        listDb.delete(id);
        patchState(store, {lists: store.lists().filter(l => l.id !== id)});
      },

      // ── Delete asset ───────────────────────────────────────────────
      deleteAsset(id: string, listId: string) {
        const lists = store.lists();
        const found = lists.find(l => l.id === listId);
        if (!found) return;
        const updated = {...found, assets: found.assets.filter(a => a.id !== id)};
        listDb.update(updated, updated.id);
        patchState(store, {lists: lists.map(l => l.id === listId ? updated : l)});
      },

      // ── Expand/collapse list ───────────────────────────────────────
      expandList(listId: string, expanded: boolean) {
        const lists = store.lists();
        const found = lists.find(l => l.id === listId);
        if (!found) return;
        const updated = {...found, expanded};
        listDb.update(updated, updated.id);
        const sorted = lists.map(l => l.id === listId ? updated : l)
          .sort((a, b) => a.order - b.order);
        patchState(store, {lists: sorted});
      },

      // ── Reorder lists ──────────────────────────────────────────────
      reorderLists(lists: AssetList[]) {
        const reordered = lists.map((l, i) => ({...l, order: i}));
        listDb.bulkPut(reordered);
        patchState(store, {lists: reordered});
      },

      // ── Change display currency ────────────────────────────────────
      changeDisplayCurrency(currency: string) {
        FiatCurrencyService.DisplayCurrency = currency;
        patchState(store, {displayCurrency: currency});
      },
    };
  }),

  // ── Hooks ─────────────────────────────────────────────────────────────
  withHooks({
    onInit(store) {
      store.initialize();
    }
  })
);
