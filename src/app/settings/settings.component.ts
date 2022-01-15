import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {FiatCurrencyService, PriceTrackerStore} from '../core';
import {filter, take, takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {LanguageService} from '@sndvll/core';
import build from '../../build';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {

  private _onDestroy: Subject<void> = new Subject<void>();

  public availableCurrencies: string[] = [];
  public availableLanguages: string[] = LanguageService.AvailableLanguages;
  public displayCurrencyControl: FormControl = new FormControl(FiatCurrencyService.DisplayCurrency);
  public changeLanguageControl: FormControl = new FormControl(LanguageService.currentLang);

  public buildInfo = build;

  @Output()
  public onClose = new EventEmitter<void>();

  constructor(private store: PriceTrackerStore,
              private language: LanguageService,
              private fiat: FiatCurrencyService) {
  }

  ngOnInit(): void {

    this.fiat.availableCurrencies
      .pipe(take(1))
      .subscribe(availableCurrencies => {
        this.availableCurrencies = availableCurrencies.sort();
      });

    this.displayCurrencyControl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        filter(currency => !!currency)
      )
      .subscribe(currency => {
        if (currency != FiatCurrencyService.DisplayCurrency) {
          this.store.changeDisplayCurrency(currency);
        }
      });

    this.changeLanguageControl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        filter(language => !!language)
      )
      .subscribe(language => {
        this.language.setLanguage(language);
      });

  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


}
