import {Component, OnDestroy, OnInit} from '@angular/core';
import {FiatCurrencyService, PriceTrackerStore} from '../core';
import {Subject} from 'rxjs';
import {switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {LanguageService} from '@sndvll/core';

@Component({
  selector: 'total-amount',
  templateUrl: './total-amount.component.html'
})
export class TotalAmountComponent implements OnInit, OnDestroy {

  private _onDestroy = new Subject<void>();

  public totalAmount: number = 0;
  public totalAverageMarketChange: number = 0;
  public displayCurrency: string = FiatCurrencyService.DisplayCurrency;
  public currenLanguage: string = LanguageService.currentLang;

  constructor(private store: PriceTrackerStore,
              private language: LanguageService,
              private fiat: FiatCurrencyService) {}

  ngOnInit() {
    this.store.totalAmount$
      .pipe(
        takeUntil(this._onDestroy),
        switchMap(amount=> this.fiat.getConvertedRateBySelectedCurrency(amount, this.displayCurrency))
        )
      .subscribe(convertedAmount=> {
        this.totalAmount = convertedAmount;
      });

    this.store.totalAverageMarketChangePercentage$
      .pipe(takeUntil(this._onDestroy))
      .subscribe(totalAverageMarketChange => this.totalAverageMarketChange = totalAverageMarketChange);

    this.language.currentLanguage$
      .pipe(takeUntil(this._onDestroy))
      .subscribe(currentLanguage => this.currenLanguage = currentLanguage);

    this.store.displayCurrency$
      .pipe(
        takeUntil(this._onDestroy),
        withLatestFrom(this.store.totalAmount$),
        switchMap(([displayCurrency, amount])=> {
          this.displayCurrency = displayCurrency;
          return this.fiat.getConvertedRateBySelectedCurrency(amount, displayCurrency)
        })
      )
      .subscribe(convertedAmount => {
        this.totalAmount = convertedAmount;
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  get negativeChange(): boolean {
    return this.totalAverageMarketChange < 0;
  }

  get veryLargeAmount(): boolean {
    return  this.totalAmount > 1000000000;
  }

}
