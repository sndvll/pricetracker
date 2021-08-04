import {Component, HostBinding, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AssetList, AssetModel, AvailableCryptoCurrency, Color, PriceTrackerStore, PullToRefreshService} from './core';
import {takeUntil} from 'rxjs/operators';
import {AddAssetService} from './add-asset';
import {CurrencyDetailsService} from './currency-details';
import {LoaderService} from './shared/components/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

 //@HostBinding('class') classList = 'bg-gray-200 dark:bg-gray-900 text-black dark:text-white max-w-screen-sm min-h-screen container';
 @HostBinding('class') classList = 'text-black dark:text-white';

  public lists: AssetList[] = [];
  public totalAmount: number = 0;
  public totalAverageMarketChange: number = 0;

  //public togglePriceControl = new FormControl(false);

  private _onDestroy = new Subject<void>();
  public Color = Color;

  constructor(
    private addAsset: AddAssetService,
    private details: CurrencyDetailsService,
    private store: PriceTrackerStore,
    private pullToRefreshService: PullToRefreshService,
    private loader: LoaderService) {
  }

  public ngOnInit() {

    this.pullToRefreshService.onDrag$
      .subscribe(() => {
        console.log('NOW');
        this.refresh();
      });

    this.store.isLoading$
      .pipe(
        takeUntil(this._onDestroy),)
      .subscribe(isLoading => {
        isLoading ? this.loader.show(true, '50') : this.loader.dismiss();
      });

    this.store.lists$
      .pipe(takeUntil(this._onDestroy))
      .subscribe(lists => {
        this.lists = lists;
        //this.togglePriceControl.setValue(!!lists.length);
      });

    this.store.totalAmount$
      .pipe(takeUntil(this._onDestroy))
      .subscribe(amount => this.totalAmount = amount);

    this.store.totalAverageMarketChangePercentage$
      .pipe(takeUntil(this._onDestroy))
      .subscribe(totalAverageMarketChange => this.totalAverageMarketChange = totalAverageMarketChange);

    /*
    this.togglePriceControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(onToggle => {
        onToggle ?
          this.store.startPricePolling() :
          this.store.stopPricePolling();
      })
     */

  }

  public refresh() {
    this.store.refreshPrices();
  }

  public editAsset({asset}: {asset: AssetModel}) {
    this.store.editAsset(asset);
  }

  public editList({name, id}: {name: string; id: string}) {
    this.store.editList(name, id);
  }

  public deleteAsset({assetId, listId}: {assetId: string; listId: string}) {
    this.store.deleteAsset(assetId, listId);
  }

  public deleteList(id: string) {
    this.store.deleteList(id);
  }

  public openDetails(currency: AvailableCryptoCurrency) {
    this.details.open(currency);
  }

  public addCurrency(currency: AvailableCryptoCurrency) {
    this.addAsset.open(currency);
  }

  public ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
