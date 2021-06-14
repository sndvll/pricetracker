import {Component, HostBinding, OnInit, TemplateRef} from '@angular/core';
import {Asset, AssetList, AppStore} from './store';
import {Subject} from 'rxjs';
import {FiatCurrencyService} from './core/fiat';
import {CryptoCurrencyService} from './core/crypto';
import {ToastService} from './shared/components/toast';
import {ModalService} from './shared/components/modal';
import {DropdownMenuService} from './shared/components/dropdown-menu';
import {takeUntil} from 'rxjs/operators';
import {Color} from './core/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

 //@HostBinding('class') classList = 'bg-gray-200 dark:bg-gray-900 text-black dark:text-white max-w-screen-sm min-h-screen container';
 @HostBinding('class') classList = 'text-black dark:text-white';

  public assets: Asset[] = [];
  public lists: AssetList[] = [];
  public totalAmount: number = 0;
  public averageMarketChange: number = 0;

  private _onDestroy = new Subject<void>();
  public Color = Color;

  constructor(
    private fiat: FiatCurrencyService,
    private crypto: CryptoCurrencyService,
    private store: AppStore,
    private toast: ToastService,
    private modal: ModalService,
    private dropdown: DropdownMenuService) {

  }

  ngOnInit() {
    console.log('app initiating');
    this.store.selectLists
      .pipe(takeUntil(this._onDestroy))
      .subscribe(lists => this.lists = lists);
    this.store.selectTotalAmount
      .pipe(takeUntil(this._onDestroy))
      .subscribe(amount => this.totalAmount = amount);
    this.store.selectAverageMarketChange
      .pipe(takeUntil(this._onDestroy))
      .subscribe(averageMarketChange => this.averageMarketChange = averageMarketChange);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openDropdown(origin: HTMLElement, templateRef: TemplateRef<any>) {
    this.dropdown.open(origin, templateRef)
  }

}
