import {Inject, Injectable, Injector} from '@angular/core';
import {BaseStore} from '../core/store';
import {AppState, Asset, AssetList, AssetsType} from './interfaces';
import {Observable, of} from 'rxjs';
import {ToastConfigBuilder, ToastService, ToastType} from '../shared';
import {map, switchMap} from 'rxjs/operators';

import * as shortid from 'shortid';
import {Color} from '../core/utils';

@Injectable({providedIn: 'root'})
export class AppStore extends BaseStore<AppState>{

  constructor(@Inject(Injector) injector: Injector, private toast: ToastService) {
    super(injector);
  }

  protected initialState(): AppState {
    return {
      lists: [
        {
          name: 'Crypto',
          type: AssetsType.Crypto,
          id: shortid.generate(),
          assets: [
            {id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', quantity: 1.00144781, rate: 33482.30, marketChange: 0.3, color: Color.red},
            {id: 'dogecoin', name: 'Dogecoin', symbol: 'doge', quantity: 200.5992, rate: 0.3456, marketChange: -13.22, color: Color.yellow},
            {id: 'shiba-inu', name: 'Shiba Inu', symbol: 'shib', quantity: 3458033.51, rate: 0.00000742, marketChange: 100, color: Color.pink},
            {id: 'binancecoin', name: 'BNB', symbol: 'bnb', quantity: 0.00844984, rate: 1.7, marketChange: -2.23, color: Color.purple},
            {id: 'ethereum', name: 'Ethereum', symbol: 'eth', quantity: 1, rate: 1.7, marketChange: 0, color: Color.blue},
          ]
        },
        {
          name: 'Stable',
          type: AssetsType.Crypto,
          id: shortid.generate(),
          assets: [
            {id: 'tether', name: 'Tether', symbol: 'usdt', quantity: 5, rate: 1, marketChange: 0, color: Color.green},
            {id: 'usd-coin', name: 'USD Coin', symbol: 'usdc', quantity: 10, rate: 1, marketChange: 0, color: Color.blue},
          ]
        }
      ]
    }
  }

  public addNewAsset(asset: Asset, listId: string) {
    asset = {...asset, rate: 10, marketChange: 5};
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

  public saveEditedAsset(editedAsset: Partial<Asset>, listId: string) {
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

  get selectAllAssetsFromAllLists(): Observable<Asset[]> {
    // This is kind of ugly but it works..
    return this.selectLists
      .pipe(
        map((lists: AssetList[]) => lists
          .reduce((acc: Asset[], current) => {
            acc.push(...current.assets);
            return acc;
          }, []))
      )
  }

  get selectAverageMarketChange(): Observable<number> {
    return this.selectAllAssetsFromAllLists
      .pipe(
        switchMap((assets: Asset[]) => {
          const sum = assets.reduce((value: number, current: Asset) => value + current.marketChange, 0);
          return of(sum / assets.length);
        })
      );
  }

  get selectTotalAmount(): Observable<number> {
    return this.selectAllAssetsFromAllLists
      .pipe(
        switchMap((assets: Asset[]) => of(assets
          .reduce((value: number, current: Asset): number => current.rate * current.quantity + value, 0)))
      );
  }

}
