import {Inject, Injectable, Injector} from '@angular/core';
import {BaseStore} from '../core';
import {AppState, AssetList, AssetModel, AssetPrice, AssetsType} from './interfaces';
import {Observable, of} from 'rxjs';
import {ToastService, ToastType} from '../shared';
import {map, switchMap, take} from 'rxjs/operators';
import * as shortid from 'shortid';
import {EventBusService, EventType} from '../core/event/event-bus.service';
import {UserAssetsDbService} from './user-assets-db.service';
import {UserListDbService} from './user-list-db.service';

@Injectable({providedIn: 'root'})
export class AppStore extends BaseStore<AppState> {

  constructor(@Inject(Injector) injector: Injector,
              private toast: ToastService,
              private event: EventBusService,
              private userListsDb: UserListDbService,
              private userAssetsDb: UserAssetsDbService) {
    super(injector);
  }

  protected initialState(): AppState {
    return {lists: [], prices: []}
  }

  init() {
    this.userListsDb.findAll()
      .pipe(
        switchMap(listModels => {
          const lists: AssetList[] = listModels?.map(list => ({...list, assets: []})) || [];
          this.setState(currentState => ({...currentState, lists}));
          return this.userAssetsDb.findAll();
        })
      )
      .subscribe((assetModels) => {
        assetModels?.forEach(assetModel => {
          this.addNewAsset(assetModel, assetModel.list, true);
        });
      });
  }

  public addNewAsset(asset: Omit<AssetModel, 'list'>, listId: string, init: boolean = false) {
    const lists = this.currentState.lists
      .map(list => {
        if (list.id === listId) {
          const assets = [...list.assets, {...asset, list: listId}];
          if (!init) {
            this.userAssetsDb.bulkAdd(assets);
          }
          return {...list, assets}
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
          this.userAssetsDb.delete(assetId);
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
    this.userListsDb.add({
      name,
      type: AssetsType.Crypto,
      id,
    })
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
    this.userListsDb.delete(id);
    this.userAssetsDb.deleteWhereListId(id);
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
