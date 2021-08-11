import {Component, HostBinding, OnInit, TemplateRef} from '@angular/core';
import {Subject} from 'rxjs';
import {AvailableCryptoCurrency, Color, DialogRef, PriceTrackerStore, PullToRefreshService} from './core';
import {takeUntil} from 'rxjs/operators';
import {AddAssetService} from './add-asset';
import {CurrencyDetailsService} from './currency-details';
import {LoaderService} from './shared/components/loader/loader.service';
import {ModalService, ModalType} from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  //@HostBinding('class') classList = 'bg-gray-200 dark:bg-gray-900 text-black dark:text-white max-w-screen-sm min-h-screen container';
  @HostBinding('class') classList = 'text-black dark:text-white';
  //public togglePriceControl = new FormControl(false);

  private _onDestroy = new Subject<void>();
  public Color = Color;

  public settingsModalRef!: DialogRef;

  constructor(
    private addAsset: AddAssetService,
    private details: CurrencyDetailsService,
    private store: PriceTrackerStore,
    private pullToRefreshService: PullToRefreshService,
    private loader: LoaderService,
    private modal: ModalService) {
  }

  public ngOnInit() {

    this.pullToRefreshService.onDrag$
      .subscribe(() => {
        console.log('NOW');
        this.refresh();
      });

    this.store.state$
      .pipe(takeUntil(this._onDestroy))
      .subscribe(({isLoading, init,}) => {
        isLoading ? this.loader.show(true, init ? '100' : '50') : this.loader.dismiss();
      })
  }

  public refresh() {
    this.store.refreshPrices();
  }

  public openDetails(currency: AvailableCryptoCurrency) {
    this.details.open(currency);
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
