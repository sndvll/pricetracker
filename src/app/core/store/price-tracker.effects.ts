import {Injectable} from '@angular/core';
import {interval, Observable, of, Subscription} from 'rxjs';
import {AssetList, AssetPrice, AssetsType, IPriceTrackerStore, PriceTrackerState} from '../model';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {PriceTrackerActions} from './price-tracker.actions';
import {catchError, filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import * as shortid from 'shortid';
import {selectAllAssetIds, selectLists, selectNumberOfLists} from './price-tracker.selectors';
import {CryptoCurrencyService} from '../crypto';
import {ListDbService} from '../persistence';
import {FiatCurrencyService} from '../fiat';


@Injectable()
export class PriceTrackerEffects {

  public state$: Observable<PriceTrackerState>;
  private _polling!: Subscription;

  constructor(private actions$: Actions,
              private store: Store<IPriceTrackerStore>,
              private listDb: ListDbService,
              private crypto: CryptoCurrencyService,
              private fiat: FiatCurrencyService,) {
    this.state$ = this.store.select(state => state.priceTrackerState);
  }

  initialize$ = createEffect(() => this.actions$.pipe(
    ofType(PriceTrackerActions.initializeStarted),
    switchMap(() => {
      this.fiat.init();
      return this.listDb.findAll()
        .pipe(
          map(lists => {
            if (lists && lists.length) {
              this.store.dispatch(PriceTrackerActions.refreshPrices());
            }
            return PriceTrackerActions.initializeDone({
              lists: lists || []
            });
          })
          );
    })
  ));
  startPricePolling$ = createEffect(() => this.actions$.pipe(
    ofType(PriceTrackerActions.startPricePolling),
    map(() => {
      this._polling = interval(2000)
        .subscribe(() => this.store.dispatch(PriceTrackerActions.refreshPrices()))
      return PriceTrackerActions.startPricePollingDone();
    })
  ));

  stopPricePolling$ = createEffect(() => this.actions$.pipe(
    ofType(PriceTrackerActions.stopPricePolling),
    map(() => {
      this._polling.unsubscribe();
      return PriceTrackerActions.stopPricePollingDone();
    })
  ));

  refreshPrices$ = createEffect(() => this.actions$.pipe(
    ofType(PriceTrackerActions.refreshPrices),
    withLatestFrom(
      this.store.select(selectAllAssetIds),
      this.store.select(selectLists)
    ),
    filter(([action, assetIds]) => {
      const proceed = !!assetIds.length;
      if (!proceed) {
        this.store.dispatch(PriceTrackerActions.refreshPricesCanceled());
      }
      return proceed;
    }),
    switchMap(([action, assetIds, lists]) =>
      this.crypto.getMarketDataForCoins(assetIds, FiatCurrencyService.BaseCurrency)
        .pipe(map((marketDataResponse: AssetPrice[]) =>
          PriceTrackerActions.refreshPricesDone({
            lists: lists.map(list => {
              const listAssetIds = list.assets.map(asset => asset.id);
              const newAssetPricesForList = marketDataResponse.filter(price => listAssetIds.includes(price.id));
              const newAssets = list.assets.map(asset => ({
                ...asset,
                price: newAssetPricesForList.find(a => a.id === asset.id)!
              }));
              const changedList = {...list, assets: newAssets};
              this.listDb.update(changedList, changedList.id);
              return changedList;
            })
          })
        ))
      ),
      catchError(error => of(PriceTrackerActions.refreshPricesError({error})))
  ));

  createNewList$ = createEffect(() => this.actions$.pipe(
    ofType(PriceTrackerActions.createNewList),
    withLatestFrom(this.store.select(selectNumberOfLists)),
    switchMap(([{name, asset}, numberOfLists]) =>
      this.crypto.getMarketDataForCoins([asset.id], FiatCurrencyService.BaseCurrency)
        .pipe(
          map(marketDataResponse => {

            const price = marketDataResponse[0];
            if (!price) {
              throw new Error('Could not get marketData response');
            }
            const id = shortid.generate();
            const list: AssetList = {
              name,
              id,
              type: AssetsType.Crypto,
              assets: [{...asset, listId: id, price}],
              expanded: true,
              order: numberOfLists + 1
            }
            this.listDb.create(list);
            return PriceTrackerActions.createNewListDone({list});
          }),
          catchError(error => of(PriceTrackerActions.createNewListError({error}))))
    )));

  addNewAsset$ = createEffect(() => this.actions$.pipe(
    ofType(PriceTrackerActions.addNewAsset),
    withLatestFrom(this.store.select(selectLists)),
    switchMap(([{listId, asset}, lists]) =>
      this.crypto.getMarketDataForCoins([asset.id], FiatCurrencyService.BaseCurrency)
        .pipe(
          map(marketDataResponse => {
            const foundList = lists.find(list => list.id === listId)!;
            const filteredLists = lists.filter(list => list.id !== listId);

            const price = marketDataResponse[0];
            if (!price) {
              throw new Error('Could not get marketData response');
            }
            const changedList = {
              ...foundList,
              assets: [...foundList.assets, {
                ...asset,
                price,
                listId
              }]
            };
            this.listDb.update(changedList, changedList.id);
            return PriceTrackerActions.addNewAssetDone({lists: [...filteredLists, changedList]})
          }),
          catchError(error => of(PriceTrackerActions.addNewAssetError({error}))))
    )));

  editList$ = createEffect(() => this.actions$.pipe(
    ofType(PriceTrackerActions.editList),
    withLatestFrom(this.store.select(selectLists)),
    map(([{name, id, order}, lists]) => {
      const foundList = lists.find(list => list.id === id)!;
      const filteredLists = lists.filter(list => list.id !== id);
      const changedList = {
        ...foundList,
        order,
        name
      }
      this.listDb.update(changedList, changedList.id);
      return PriceTrackerActions.editListDone({
        lists: [...filteredLists, changedList]
      });
    }),
  ));

  editAsset$ = createEffect(() => this.actions$.pipe(
    ofType(PriceTrackerActions.editAsset),
    withLatestFrom(this.store.select(selectLists)),
    map(([{asset}, lists]) => {
      const foundList = lists.find(list => list.id === asset.listId)!;
      const filteredLists = lists.filter(list => list.id !== asset.listId);
      const filteredAssets = foundList.assets.filter(a => a.id !== asset.id);
      const changedList = {
        ...foundList,
        assets: [...filteredAssets, asset]
      };
      this.listDb.update(changedList, changedList.id);
      return PriceTrackerActions.editAssetDone({
        lists: [...filteredLists, changedList]
      });
    }),
  ));

  deleteList$ = createEffect(() => this.actions$.pipe(
    ofType(PriceTrackerActions.deleteList),
    withLatestFrom(this.store.select(selectLists)),
    map(([{id}, lists]) => {
      this.listDb.delete(id);
      return PriceTrackerActions.deleteListDone({
        lists: lists.filter(list => list.id !== id)
      });
    })
  ));

  deleteAsset$ = createEffect(() => this.actions$.pipe(
    ofType(PriceTrackerActions.deleteAsset),
    withLatestFrom(this.store.select(selectLists)),
    map(([{id, listId}, lists]) => {
      const foundList = lists.find(list => list.id === listId)!;
      const filteredLists = lists.filter(list => list.id !== listId);
      const changedList = {
        ...foundList,
        assets: foundList.assets.filter(a => a.id !== id)
      };
      this.listDb.update(changedList, changedList.id);
      return PriceTrackerActions.deleteAssetDone({
        lists: [...filteredLists, changedList]
      })
    }),
  ));

  expandList$ = createEffect(() => this.actions$.pipe(
    ofType(PriceTrackerActions.expandList),
    withLatestFrom(this.store.select(selectLists)),
    map(([{listId, expanded}, lists]) => {

      const foundList = lists.find(list => list.id === listId)!;
      const filteredLists = lists.filter(list => list.id !== listId);
      const changedList = {
        ...foundList,
         expanded
      };
      this.listDb.update(changedList, changedList.id);

      return PriceTrackerActions.expandListDone({
        lists: [...filteredLists, changedList]
          .sort()
      })
    })
  ));
}
