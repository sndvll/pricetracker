import {Component, OnDestroy, OnInit} from "@angular/core";
import {
  ConnectedDialogConfigBuilder,
  CryptoCurrencyService,
  DialogService,
  FiatCurrencyService, GlobalDialogConfigBuilder
} from "../core";
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

    //this.openToast();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openConnected(origin: HTMLElement) {
    this.dialog.open<TestComponent>(new ConnectedDialogConfigBuilder<TestComponent>()
      .component(TestComponent)
      .origin(origin)
      .config);
  }

  openToast() {
    this.toast.open(ToastConfigBuilder.success({time: 10, message: 'Detta är ett meddelande'}));
  }

  openModal() {

    const config = new GlobalDialogConfigBuilder<TestComponent>()
      .component(TestComponent)
      .config;

    this.dialog.open(config);
  }

  add() {
    this.store.add({name: 'Nano', shortName: 'nano', quantity: 16, rate: 7.8, change: 10});
  }

}
