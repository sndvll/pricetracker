import {Inject, Injectable, Injector} from '@angular/core';
import {BaseStore} from '../../core/state';
import {Asset, AssetState} from './interfaces';
import {Observable} from 'rxjs';
import {ToastConfigBuilder, ToastService} from '../../shared';

@Injectable()
export class AssetStore extends BaseStore<AssetState>{

  constructor(@Inject(Injector) injector: Injector, private toast: ToastService) {
    super(injector);
  }

  protected initialState(): AssetState {
    return {
      assets: [
        {name: 'Bitcoin', shortName: 'btc', quantity: 0.5674, rate: 40000, change: 2.13},
        {name: 'Doge', shortName: 'doge', quantity: 200.4322, rate: 0.3456, change: -30},
        {name: 'Cardano', shortName: 'ada', quantity: 153, rate: 1.7, change: 10},
      ]
    }
  }

  add(asset: Asset) {
    if (!this.currentState.assets.some(a => a.shortName === asset.shortName)) {
      this.setState(currentState => ({...currentState, assets: [...currentState.assets, asset]}), 'add-asset');
    } else {
      this.toast.open(ToastConfigBuilder.info({time: 0, message: 'Asset already added'}));
    }
  }

  get selectAssets(): Observable<Asset[]> {
    return this.selectState(state => [...state.assets]);
  }

  get selectTotalAmount(): Observable<number> {
    return  this.selectState(state => state.assets.reduce((value: number, current: Asset): number => current.rate * current.quantity + value, 0));
  }

}
