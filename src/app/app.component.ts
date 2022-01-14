import {Component, HostBinding, OnInit, TemplateRef} from '@angular/core';
import {Subject} from 'rxjs';
import {AvailableCryptoCurrency, PriceTrackerStore} from './core';
import {filter, takeUntil} from 'rxjs/operators';
import {AddAssetService} from './add-asset';
import {CurrencyDetailsService} from './currency-details';
import {ModalService, ModalType} from '@sndvll/components';
import {Color, OverlayRef, PullToRefreshService} from '@sndvll/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
    private modal: ModalService) {
  }

  public ngOnInit() {

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
