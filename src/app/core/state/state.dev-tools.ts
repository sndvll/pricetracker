import {Injectable} from '@angular/core';

@Injectable()
export class StateDevTools {
  // @ts-ignore
  private _globalDevtools: any = window['__REDUX_DEVTOOLS_EXTENSION__'] || window['devToolsExtension'];
  private readonly _localDevTool: any;
  private readonly _isActive: boolean = false;
  private _instanceId = `state-${Date.now()}`;
  private _baseState: { [key: string]: any } = {};

  constructor() {
    if (this._globalDevtools) {
      this._localDevTool = this._globalDevtools.connect({
        name: 'state',
        instanceId: this._instanceId
      });
      this._isActive = !!this._localDevTool;
      if (this._isActive) {
        this._localDevTool.init(this._baseState);
      }
    }
  }

  public isActive(): boolean {
    return this._isActive;
  }

  send(storeName: string, actionName: string, state: any): boolean {
    if (this._isActive) {
      this._localDevTool.send(`${storeName}.${actionName}`, Object.assign(this._baseState, {[storeName]: state}), false, this._instanceId);
      return true;
    }
    return false;
  }
}
