import {Inject, Injectable, Injector} from '@angular/core';
import {BaseStore, Color} from '../core';
import {AppState, AssetList, AssetModel, AssetPrice, AssetsType} from './interfaces';
import {Observable, of} from 'rxjs';
import {ToastConfigBuilder, ToastService, ToastType} from '../shared';
import {map, switchMap, take} from 'rxjs/operators';

import * as shortid from 'shortid';
import {EventBusService, EventType} from '../core/event/event-bus.service';

@Injectable({providedIn: 'root'})
export class AppStore extends BaseStore<AppState> {

  constructor(@Inject(Injector) injector: Injector,
              private toast: ToastService,
              private event: EventBusService) {
    super(injector);
  }

  protected initialState(): AppState {
    //return {lists: [], prices: []}
    return {
      prices: [
       /* {
          "id": "bitcoin",
          "symbol": "btc",
          "name": "Bitcoin",
          "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
          "current_price": 39776,
          "market_cap": 746123600732,
          "market_cap_rank": 1,
          "fully_diluted_valuation": 834578510482,
          "total_volume": 30646507286,
          "high_24h": 41505,
          "low_24h": 39189,
          "price_change_24h": -1215.799144516503,
          "price_change_percentage_24h": -2.96592,
          "market_cap_change_24h": -23760746090.624268,
          "market_cap_change_percentage_24h": -3.08627,
          "circulating_supply": 18774262,
          "total_supply": 21000000,
          "max_supply": 21000000,
          "ath": 64805,
          "ath_change_percentage": -38.62187,
          "ath_date": new Date("2021-04-14T11:54:46.763Z"),
          "atl": 67.81,
          "atl_change_percentage": 58558.77424,
          "atl_date":  new Date("2013-07-06T00:00:00.000Z"),
          "roi": null,
          "last_updated":  new Date("2021-08-02T17:36:40.469Z")
        },
        {
          "id": "ethereum",
          "symbol": "eth",
          "name": "Ethereum",
          "image": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
          "current_price": 2639.1,
          "market_cap": 308122450036,
          "market_cap_rank": 2,
          "fully_diluted_valuation": null,
          "total_volume": 29536051430,
          "high_24h": 2687.04,
          "low_24h": 2522.63,
          "price_change_24h": 84.19,
          "price_change_percentage_24h": 3.29536,
          "market_cap_change_24h": 7385749595,
          "market_cap_change_percentage_24h": 2.45589,
          "circulating_supply": 116943349.4365,
          "total_supply": null,
          "max_supply": null,
          "ath": 4356.99,
          "ath_change_percentage": -39.39122,
          "ath_date":  new Date("2021-05-12T14:41:48.623Z"),
          "atl": 0.432979,
          "atl_change_percentage": 609795.51598,
          "atl_date":  new Date("2015-10-20T00:00:00.000Z"),
          "roi": {
            "times": 87.68452259875633,
            "currency": "btc",
            "percentage": 8768.452259875634
          },
          "last_updated":  new Date("2021-08-02T17:36:35.458Z")
        } */
      ],
      lists: [
        {
          name: 'Crypto',
          type: AssetsType.Crypto,
          id: shortid.generate(),
          assets: [
            {id: 'ethereum', name: 'Ethereum', symbol: 'eth', quantity: 0.3177, color: Color.blue},
            {id: 'cardano', name: 'Cardano', symbol: 'ada', quantity: 258.44, color: Color.gray},
            {id: 'algorand', name: 'Algorand', symbol: 'algo', quantity: 247.90, color: Color.black},
          ]
        }
      ]
    }
  }

  public addNewAsset(asset: AssetModel, listId: string) {

    const lists = this.currentState.lists
      .map(list => {
        if (!list.assets.some(a => a.symbol === asset.symbol)) {
          if (list.id ===listId) {
            const assets = [...list.assets, asset];
            return {...list, assets}
          }
        } else {
          this.toast.open(ToastConfigBuilder.warning({
            message: `Asset already added to list named ${list.name}`
          }));
        }
        return list;
      });
    this.setState(currentState => ({...currentState, lists}));
  }

  public saveEditedAsset(editedAsset: Partial<AssetModel>, listId: string) {
    const lists = this.currentState.lists
      .map(list => {
        if (list.id === listId) {
          const assets = list.assets.map(asset => {
            if (asset.id === editedAsset.id) {
              return {...asset, ...editedAsset};
            }
            return asset;
          });
          return {...list, assets};
        }
        return list;
      });
    this.setState(currentState => ({...currentState, lists}));
  }

  public deleteAsset(assetId: string, listId: string) {
    const lists = this.currentState.lists
      .map(list => {
        if (list.id === listId) {
          return {...list, assets: list.assets.filter(asset => asset.id !== assetId)};
        }
        return list;
      });
    this.setState(currentState => ({...currentState, lists}));
  }

  public createList(name: string): string {
    const id = shortid.generate();
    const lists = [...this.currentState.lists, {
      name,
      type: AssetsType.Crypto,
      id,
      assets: []
    }];
    this.setState(currentState => ({...currentState, lists}))
    return id;
  }

  public editList(name: string, id: string) {
    const lists = this.currentState.lists.map(list => {
      if (list.id === id) {
        return { ...list, name }
      }
      return list;
    });
    this.setState(currentState => ({...currentState, lists}));
  }

  public deleteList(id: string) {
    const filteredLists = this.currentState.lists.filter(list => list.id !== id);
    this.setState(() => ({lists: filteredLists}));
    this.toast.open({
      type: ToastType.Warning,
      message: 'List deleted',
      time: 5
    });
  }

  get selectLists(): Observable<AssetList[]> {
    return this.selectState(state => state.lists);
  }

  get selectAllAssetsFromAllLists(): Observable<AssetModel[]> {
    // This is kind of ugly but it works..
    return this.selectLists
      .pipe(
        map((lists: AssetList[]) => lists
          .reduce((acc: AssetModel[], current) => {
            acc.push(...current.assets);
            return acc;
          }, []))
      )
  }

  get selectAllAssetIds(): Observable<string[]> {
    return this.selectAllAssetsFromAllLists
      .pipe(map(allAssets => allAssets.map(asset => asset.id)));
  }

  get selectAverageMarketChange(): Observable<number> {
    return this.selectAllAssetsFromAllLists
      .pipe(
        take(1),
        switchMap((assets: AssetModel[]) => {
          const sum = assets.reduce((value: number, current: AssetModel) => value + this.getCurrentPriceChangePercentage(current.id), 0);
          return of(sum / assets.length);
        })
      );
  }

  get selectTotalAmount(): Observable<number> {
    return this.selectAllAssetsFromAllLists
      .pipe(
        take(1),
        switchMap((assets: AssetModel[]) =>
          of(assets.reduce((value: number, current: AssetModel): number =>
            this.getCurrentRate(current.id) * current.quantity + value, 0)))
      );
  }

  getCurrentRate(id: string) {
    return this.currentState.prices.find(price => price.id === id)?.current_price || 0;
  }

  getCurrentPriceChangePercentage(id: string) {
    return this.currentState.prices.find(price => price.id === id)?.price_change_percentage_24h || 0;
  }

  updatePrices(prices: AssetPrice[]): void {
    this.setState(currentState => ({...currentState, prices}));
    this.event.next(EventType.PRICE);
  }

}
