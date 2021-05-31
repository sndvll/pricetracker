import {AfterViewInit, Component} from "@angular/core";
import {Asset, FiatCurrencyService} from "../core";
import {CryptoCurrencyService} from '../core/crypto';
import {TestComponent} from './components/test.component';
import {DialogService} from '../core/dialog';

@Component({
  selector: 'tracker',
  templateUrl: './tracker-page.component.html',
  styleUrls: ['./tracker-page.component.scss']
})
export class TrackerPageComponent implements AfterViewInit {

  public assets: Asset[] = [
    {name: 'Bitcoin', shortName: 'btc', quantity: 0.5674, rate: 40000, change: 2.13},
    {name: 'Doge', shortName: 'doge', quantity: 200.4322, rate: 0.3456, change: -30},
    {name: 'Nano', shortName: 'nano', quantity: 16, rate: 7.8, change: 10},
    {name: 'Cardano', shortName: 'ada', quantity: 153, rate: 1.7, change: 10},
  ];

  constructor(
    private fiat: FiatCurrencyService,
    private crypto: CryptoCurrencyService,
    private dialog: DialogService) {}

  ngAfterViewInit() {
    this.openDialog();
  }

  openDialog(){
    this.dialog.open(TestComponent, {});
  }

  get totalAssetAmount(): number {
    return this.assets.reduce((value, current): number => current.rate * current.quantity + value, 0);
  }

}
