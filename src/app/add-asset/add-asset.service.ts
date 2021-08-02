import {Injectable} from '@angular/core';
import {AvailableCryptoCurrency, DialogRef, DialogService, GlobalDialogConfigBuilder} from '../core';
import {AddAssetComponent} from './add-asset.component';

@Injectable({providedIn: 'root'})
export class AddAssetService {

  constructor(private dialog: DialogService) {}

  public open(currency: AvailableCryptoCurrency): DialogRef {
    const dialogConfig = GlobalDialogConfigBuilder
      .full<AddAssetComponent, AvailableCryptoCurrency>(AddAssetComponent)
      .data(currency)
      .config;

    return this.dialog.open(dialogConfig);
  }
}
