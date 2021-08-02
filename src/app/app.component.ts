import {Component, HostBinding, OnInit} from '@angular/core';
import {AppStore, AssetList} from './store';
import {Subject} from 'rxjs';
import {AvailableCryptoCurrency, Color, FiatCurrencyService} from './core';
import {filter, takeUntil} from 'rxjs/operators';
import {AddAssetService} from './add-asset/add-asset.service';
import {CurrencyDetailsService} from './currency-details/currency-details.service';
import {PriceService} from './prices/price.service';
import {FormControl} from '@angular/forms';
import {EventBusService, EventType} from './core/event/event-bus.service';

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
  public averageMarketChange: number = 0;

  public togglePriceControl = new FormControl(false);

  private _onDestroy = new Subject<void>();
  public Color = Color;

  constructor(
    private fiat: FiatCurrencyService,
    private store: AppStore,
    public price: PriceService,
    private addAsset: AddAssetService,
    private details: CurrencyDetailsService,
    private event: EventBusService) {
  }

  public ngOnInit() {
    // Init subscriptions from store.
    this.store.selectLists
      .pipe(takeUntil(this._onDestroy))
      .subscribe(lists => {
        this.lists = lists;
        this.togglePriceControl.setValue(!!lists.length);
      });

    this._handlePrices();
    this._handleEvents();

    this.store.init();

    this.event.next(EventType.INIT);
  }

  private _handlePrices() {
    if (this.togglePriceControl.value) {
      this.price.start();
    }

    this.togglePriceControl
      .valueChanges
      .subscribe(onToggle => {
        if (onToggle) {
          this.price.start();
        } else {
          this.price.stop();
        }
      });
  }

  private _handleEvents() {
    this.event.on([EventType.PRICE, EventType.INIT])
      .subscribe(() => {
        this.store.selectTotalAmount
          .pipe(takeUntil(this._onDestroy))
          .subscribe(amount => this.totalAmount = amount);
        this.store.selectAverageMarketChange
          .pipe(takeUntil(this._onDestroy))
          .subscribe(averageMarketChange => this.averageMarketChange = averageMarketChange);
      });
  }

  public openDetails(currency: AvailableCryptoCurrency) {
    this.details.open(currency);
  }

  public addCurrency(currency: AvailableCryptoCurrency) {
    const dialogRef = this.addAsset.open(currency);
    dialogRef.onClose$
      .pipe(filter(newAsset => !!newAsset))
      .subscribe(newAsset => {
        const {id, name, symbol, quantity, color} = newAsset;
        const listId = newAsset.createList ? this.store.createList(newAsset.list) : newAsset.list;
        this.store.addNewAsset({
          id,
          quantity,
          color,
          name,
          symbol,
        }, listId);
      })
  }

  public ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
