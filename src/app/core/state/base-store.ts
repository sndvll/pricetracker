import {Inject, Injectable, Injector, OnDestroy} from '@angular/core';
import {asyncScheduler, BehaviorSubject, Observable} from 'rxjs';
import {StateDevTools} from './state.dev-tools';
import {STORE_CONFIG, StoreConfig} from './state.config';
import {distinctUntilChanged, map, observeOn} from 'rxjs/operators';
import {DeviceDetectorService} from 'ngx-device-detector';

@Injectable()
export abstract class BaseStore<S extends object | Array<any>> implements OnDestroy {

  private _state: BehaviorSubject<S>;
  private _devTools: StateDevTools;
  private _localStoreConfig: StoreConfig;
  private readonly _devToolsIsEnabled: boolean = true;
  private readonly _storeName: string;
  private readonly _firstState: S;
  private readonly _isArray: boolean;

  public get state$(): Observable<S> {
    return this._state.asObservable();
  }

  protected constructor(@Inject(Injector) injector: Injector) {
    const device = injector.get(DeviceDetectorService);
    this._devTools = injector.get(StateDevTools);
    const globalConfig = injector.get(STORE_CONFIG, {});
    const storeConfig = this.storeConfig() || {};
    this._localStoreConfig = {...globalConfig, ...storeConfig};

    this._devToolsIsEnabled = this._localStoreConfig.enableDevTools && device.isDesktop() && device.browser.toLowerCase() === 'chrome';
    console.log(this._devToolsIsEnabled);
    this._storeName = this._localStoreConfig.storeName || this.constructor.name;

    this._firstState = this.initialState();

    this._devToolSend(this._firstState, 'initialState');

    this._isArray = Array.isArray(this._firstState);
    this._state = new BehaviorSubject<S>(Object.assign(this._isArray? [] : {}, this._firstState));
  }

  protected abstract initialState(): S;

  public selectState<K>(selectFn?: (state: Readonly<S>) => K):Observable<K> {
    if (!selectFn) {
      selectFn = (tmpState: Readonly<S>): any => Object.assign(this._isArray ? [] : {}, tmpState);
    }

    return this.state$.pipe(
      // @ts-ignore
      map(state => selectFn(state as Readonly<S>)),
      distinctUntilChanged(),
      observeOn(asyncScheduler)
    );
  }

  public setState(stateFn: (currentState: Readonly<S>) => Partial<S>, actionName?: string): void {
    const newState = stateFn(this.currentState);
    let state: S;
    if (this._isArray) {
      state = Object.assign([], newState) as any;
    } else {
      state = Object.assign({}, this.currentState, newState);
    }
    this._devToolSend(state, actionName);
    this._state.next(state);
  }

  public storeConfig(): StoreConfig | null {
    return null;
  }

  public get currentState(): S {
    return this._state.getValue();
  }

  public resetState(): void {
    this.setState(() => (this._firstState), 'resetState');
  }

  public restartState(): void {
    this.setState(() => (this.initialState()), 'restartState');
  }

  private _devToolSend(newState?: S, actionName?: string): boolean {
    if (!this._devToolsIsEnabled) {
      return false;
    }
    if (!actionName) {
      // @ts-ignore
      actionName = new Error().stack
        .split('\n')[3]
        .trim()
        .split(' ')[1]
        .split('.')[1];
    }
    return this._devTools.send(this._storeName, actionName, newState);
  }

  ngOnDestroy(): void {
    this._devToolSend(undefined, 'destroy');
    this._state.complete();
  }

}
