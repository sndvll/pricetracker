import {Injectable} from '@angular/core';
import {AvailableCryptoCurrency} from '../core';
import {AddAssetComponent} from './add-asset.component';
import {GlobalOverlayConfigBuilder, OverlayRef, OverlayService} from '@sndvll/core';

@Injectable({providedIn: 'root'})
export class AddAssetService {

  constructor(private dialog: OverlayService) {}

  public open(currency: AvailableCryptoCurrency): OverlayRef {
    const dialogConfig = GlobalOverlayConfigBuilder
      .full<AddAssetComponent, AvailableCryptoCurrency>(AddAssetComponent)
      .withBackdrop(false)
      .data(currency)
      .config;

    return this.dialog.open(dialogConfig);
  }
}
