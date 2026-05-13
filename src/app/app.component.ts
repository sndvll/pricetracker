import {Component, HostBinding, Inject, OnInit, TemplateRef} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {CommonModule} from '@angular/common';
import {Subject} from 'rxjs';
import {AvailableCryptoCurrency, PriceTrackerStore} from './core';
import {filter, takeUntil} from 'rxjs/operators';
import {AddAssetService} from './add-asset';
import {CurrencyDetailsService} from './currency-details';
import {ModalService, ModalType, ButtonModule, LoaderModule} from '@sndvll/components';
import {Color, OverlayRef, PullToRefreshService} from '@sndvll/core';
import {IconsModule} from './shared';
import {TotalAmountComponent} from './total-amount';
import {CryptoSearchbarComponent} from './crypto-searchbar';
import {AssetListsComponent} from './assets-list';
import {SettingsComponent} from './settings/settings.component';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [CommonModule, IconsModule, ButtonModule, LoaderModule, TotalAmountComponent, CryptoSearchbarComponent, AssetListsComponent, SettingsComponent]
})
export class AppComponent implements OnInit {

  @HostBinding('class') classList = 'text-black dark:text-white';

  private _onDestroy = new Subject<void>();
  public Color = Color;

  public settingsModalRef!: OverlayRef;
  public isLoading: boolean = true;
  public numberOfLists: number = 0;

  constructor(
    private addAsset: AddAssetService,
    private details: CurrencyDetailsService,
    private store: PriceTrackerStore,
    private pullToRefreshService: PullToRefreshService,
    private modal: ModalService,
    private device: DeviceDetectorService,
    @Inject(DOCUMENT) private document: Document) {
  }

  public ngOnInit() {
    const metaEl = this.document.querySelector('meta[name=viewport]')!;
    if (this.device.device.toLowerCase() === 'iphone' || this.document.defaultView!.matchMedia('(display-mode: standalone)').matches) {
      metaEl.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
    } else {
      metaEl.setAttribute('content', 'width=device-width, initial-scale=1');
    }

    this.pullToRefreshService.onDrag$
      .subscribe(() =>
        this.refresh());

    this.store.isLoading$
      .pipe(takeUntil(this._onDestroy))
      .subscribe(isLoading =>
        this.isLoading = isLoading);

    this.store.numberOfLists$
      .pipe(takeUntil(this._onDestroy))
      .subscribe(numberOfLists =>
        this.numberOfLists = numberOfLists);
  }

  public refresh() {
    this.store.refreshPrices();
  }

  public openDetails(currency: AvailableCryptoCurrency) {
    this.details.open(currency)
      .onClose$
      .pipe(filter(currency => !!currency))
      .subscribe(currency => this.addCurrency(currency))
    ;
  }

  public addCurrency(currency: AvailableCryptoCurrency) {
    this.addAsset.open(currency);
  }

  public openSettings(settingsTemplate: TemplateRef<any>) {
    this.settingsModalRef = this.modal.open({
      type: ModalType.Right,
      templateRef: settingsTemplate,
    });
  }

  public ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
