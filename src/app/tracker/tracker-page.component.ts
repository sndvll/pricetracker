import {Component, OnDestroy, OnInit} from "@angular/core";
import {CryptoCurrencyService, DialogConfigBuilder, DialogService, FiatCurrencyService} from "../core";
import {Asset, AssetStore} from './store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ToastService, ToastConfigBuilder} from '../shared/components/toast';
import {TestComponent} from './components/test.component';

@Component({
  selector: 'tracker',
  templateUrl: './tracker-page.component.html',
  styleUrls: ['./tracker-page.component.scss']
})
export class TrackerPageComponent implements OnInit, OnDestroy {

  public assets: Asset[] = [];
  public totalAmount: number = 0;

  private _onDestroy = new Subject<void>();

  constructor(
    private fiat: FiatCurrencyService,
    private crypto: CryptoCurrencyService,
    private store: AssetStore,
    private toast: ToastService,
    private dialog: DialogService) {}

  ngOnInit() {
    this.store.selectAssets
      .pipe(takeUntil(this._onDestroy))
      .subscribe(assets => this.assets = assets);
    this.store.selectTotalAmount
      .pipe(takeUntil(this._onDestroy))
      .subscribe(amount => this.totalAmount = amount);

    this.toast.open('Detta är ett meddelande', ToastConfigBuilder.error({time: 0}));
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openModal() {
    this.dialog.open(TestComponent, DialogConfigBuilder.Default());
  }

  add() {
    this.store.add({name: 'Nano', shortName: 'nano', quantity: 16, rate: 7.8, change: 10});
  }

}
