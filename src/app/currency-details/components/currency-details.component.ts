import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AvailableCryptoCurrency,
  CoingeckoApiDetailsResponse,
  CryptoCurrencyService,
  DIALOG_REF,
  DialogRef
} from '../../core';
import {Chart, ChartType, TimeSpan} from '../interfaces';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  templateUrl: './currency-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyDetailsComponent implements OnInit {


  public currency: AvailableCryptoCurrency;
  public details!: CoingeckoApiDetailsResponse;

  public ChartType = ChartType;
  public priceChart!: Chart[];
  public marketCapChart!: Chart[];
  public volumeChart!: Chart[];

  public priceTimeSpan: TimeSpan = TimeSpan.Month;
  public marketCapTimeSpan: TimeSpan = TimeSpan.Month;
  public volumeTimeSpan: TimeSpan = TimeSpan.Month;

  public daily: boolean;

  private _loadedDetails = false;
  private _loadedChartData = false;

  get isLoaded() {
    return this._loadedDetails && this._loadedChartData;
  }

  @ViewChild('chartsContainer') chartsContainer!: ElementRef;

  @HostBinding('class') classList = 'bg-gray-100 dark:bg-black flex flex-col overflow-hidden pb-10';

  constructor(@Inject(DIALOG_REF) private dialogRef: DialogRef<CurrencyDetailsComponent, AvailableCryptoCurrency>,
              private crypto: CryptoCurrencyService,
              private changeDetectorRef: ChangeDetectorRef,
              private device: DeviceDetectorService) {
    console.log(dialogRef);
    this.currency = dialogRef.config.data!;
    this.daily = device.isMobile();
  }

  ngOnInit() {
    const { id } = this.currency;
    this.crypto.fetchDetails(id)
      .subscribe(details => {
        console.log(details);
        this.details = details;
        this._loadedDetails = true;
        this.changeDetectorRef.markForCheck();
      });
      this.loadChartData(this.getDays(TimeSpan.Month));
  }

  setTimeSpan(timeSpan: TimeSpan, type: ChartType) {
    if (type === 'price') {
      this.priceTimeSpan = timeSpan;
    }
    if (type === 'market') {
      this.marketCapTimeSpan = timeSpan;
    }
    if (type === 'volume') {
      this.volumeTimeSpan = timeSpan;
    }
    this.loadChartData(this.getDays(timeSpan));
    this.changeDetectorRef.markForCheck();
  }

  private static checkChartType(type: ChartType | 'all', check: ChartType) {
    return type === check || type === 'all';
  }

  loadChartData(days: number, type: ChartType | 'all' = 'all') {
    console.log(type);
    if (CurrencyDetailsComponent.checkChartType(type, ChartType.Price)) {
      this.priceChart = [];
    }
    if (CurrencyDetailsComponent.checkChartType(type, ChartType.Market)) {
      this.marketCapChart = [];
    }
    if (CurrencyDetailsComponent.checkChartType(type, ChartType.Volume)) {
      this.volumeChart = [];
    }
    this.crypto.chartData(this.currency, 'usd', days, this.daily)
      .subscribe(chartData => {
        const {price, volume, marketCap} = chartData;

        if (CurrencyDetailsComponent.checkChartType(type, ChartType.Price)) {
          this.priceChart = [{
            name: 'Price',
            series: price
          }];
        }
        if (CurrencyDetailsComponent.checkChartType(type, ChartType.Market)) {
          this.marketCapChart = [{
            name: 'Market cap',
            series: marketCap
          }];
        }
        if (CurrencyDetailsComponent.checkChartType(type, ChartType.Volume)) {
          this.volumeChart = [{
            name: 'Volume',
            series: volume
          }];
        }
        this._loadedChartData = true;
        this.changeDetectorRef.markForCheck();
      });
  }


  timeSpanChange(event: { timeSpan: TimeSpan, type: ChartType }) {
    const {timeSpan, type} = event;
    this.loadChartData(this.getDays(timeSpan), type);
  }

  hourlyChange(event: { daily: boolean, timeSpan: TimeSpan, type: ChartType }) {
    const {timeSpan, type, daily} = event;
    this.daily = daily;
    this.loadChartData(this.getDays(timeSpan), type);
  }

  getDays(timeSpan: TimeSpan): number {
    return {
      '1y': 365,
      '1m': 31,
      '1w': 7,
      '24h': 1,
    }[timeSpan];
  }

  close() {
    this.dialogRef.close();
  }
}
