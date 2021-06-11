import {Inject, Injectable, Injector} from '@angular/core';
import {BaseStore} from '../core/store';
import {AppState, Asset, AssetList} from './interfaces';
import {Observable, of} from 'rxjs';
import {ToastService, ToastType} from '../shared';
import {switchMap} from 'rxjs/operators';

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
          id: shortid.generate(),
          assets: [
            {id: shortid.generate(), name: 'Bitcoin', shortname: 'btc', quantity: 1.00144781, rate: 33482.30, marketChange: 56, color: Color.red},
            {id: shortid.generate(), name: 'Doge', shortname: 'doge', quantity: 200.5992, rate: 0.3456, marketChange: -30, color: Color.yellow},
            {id: shortid.generate(), name: 'Shiba Inu', shortname: 'shib', quantity: 3458033.51, rate: 0.00000742, marketChange: 10, color: Color.pink},
            {id: shortid.generate(), name: 'BNB', shortname: 'bnb', quantity: 0.00844984, rate: 1.7, marketChange: 10, color: Color.purple},
            {id: shortid.generate(), name: 'Ether', shortname: 'eth', quantity: 1, rate: 1.7, marketChange: 10, color: Color.blue},
          ]
        },
        {
          name: 'Stable',
          id: shortid.generate(),
          assets: [
            {id: shortid.generate(), name: 'TetherUSD', shortname: 'usdt', quantity: 5, rate: 1, marketChange: 0, color: Color.green},
            {id: shortid.generate(), name: 'USD Coin', shortname: 'usdc', quantity: 10, rate: 1, marketChange: 0, color: Color.blue},
          ]
        }
      ]
    }
  }

  public add(asset: Asset) {
    /*if (!this.currentState.assets.some(a => a.shortName === asset.shortName)) {
      this.setState(currentState => ({...currentState, assets: [...currentState.assets, asset]}), 'add-asset');
    } else {
      this.toast.open(ToastConfigBuilder.info({time: 0, message: 'Asset already added'}));
    }*/
  }

  public editAsset(editedAsset: Partial<Asset>, listId: string) {
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

  public editList(name: string, id: string) {
    const lists = this.currentState.lists.map(list => {
      if (list.id === id) {
        return { ...list, name }
      }
      return list;
    });
    this.setState(currentState => ({...currentState, lists}));
  }

  public removeList(id: string) {
    const filteredLists = this.currentState.lists.filter(list => list.id !== id);
    this.setState(() => ({lists: filteredLists}));
    this.toast.open({
      type: ToastType.Warning,
      message: 'List deleted',
      time: 5
    });
  }

  get selectLists(): Observable<AssetList[]> {
    return this.selectState(state => [...state.lists]);
  }


  get selectTotalAmount(): Observable<number> {
    // This is kind of ugly but it works..
    const assets: Observable<Asset[]> = this.selectState(state => state.lists
      .reduce((assets: Asset[], list) => {
        assets.push(...list.assets);
        return assets;
      }, [])
    );

    return assets
      .pipe(
        switchMap((assets: Asset[]) => of(assets
          .reduce((value: number, current: Asset): number => current.rate * current.quantity + value, 0)))
      );
  }

}
