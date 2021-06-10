import {Inject, Injectable, Injector} from '@angular/core';
import {BaseStore} from '../core/state';
import {AppState, Asset, AssetList} from './interfaces';
import {Observable, of} from 'rxjs';
import {ToastService, ToastType} from '../shared';
import {switchMap} from 'rxjs/operators';

import * as shortid from 'shortid';
import {DialogXPosition} from '../core/dialog';

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
            {id: shortid.generate(), name: 'Bitcoin', shortName: 'btc', quantity: 1.00144781, rate: 33482.30, marketChange: 56, color: 'red'},
            {id: shortid.generate(), name: 'Doge', shortName: 'doge', quantity: 200.5992, rate: 0.3456, marketChange: -30, color: 'yellow'},
            {id: shortid.generate(), name: 'Shiba Inu', shortName: 'shib', quantity: 3458033.51, rate: 0.00000742, marketChange: 10, color: 'pink'},
            {id: shortid.generate(), name: 'BNB', shortName: 'bnb', quantity: 0.00844984, rate: 1.7, marketChange: 10, color: 'pink'},
            {id: shortid.generate(), name: 'Ether', shortName: 'eth', quantity: 1, rate: 1.7, marketChange: 10, color: 'blue'},
          ]
        },
        {
          name: 'Stable',
          id: shortid.generate(),
          assets: [
            {id: shortid.generate(), name: 'TetherUSD', shortName: 'usdt', quantity: 5, rate: 1, marketChange: 0, color: 'green'},
            {id: shortid.generate(), name: 'USD Coin', shortName: 'usdc', quantity: 10, rate: 1, marketChange: 0, color: 'blue'},
          ]
        }
      ]
    }
  }

  add(asset: Asset) {
    /*if (!this.currentState.assets.some(a => a.shortName === asset.shortName)) {
      this.setState(currentState => ({...currentState, assets: [...currentState.assets, asset]}), 'add-asset');
    } else {
      this.toast.open(ToastConfigBuilder.info({time: 0, message: 'Asset already added'}));
    }*/
  }

  editList(name: string, id: string) {
    const lists = this.currentState.lists.map(list => {
      if (list.id === id) {
        return { ...list, name }
      }
      return list;
    });
    this.setState(() => ({lists}));
  }

  removeList(id: string) {
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
