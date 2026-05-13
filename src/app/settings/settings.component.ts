import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {Subject} from 'rxjs';
import {DataExportService, FiatCurrencyService, PriceTrackerStore} from '../core';
import {filter, take, takeUntil} from 'rxjs/operators';
import {UntypedFormControl} from '@angular/forms';
import {LanguageService} from '@sndvll/core';
import {environment} from '../../environments/environment';
import build from '../../build';
import {SelectModule, ButtonModule} from '@sndvll/components';
import {IconsModule} from '../shared';
import {TranslateModule} from '@ngx-translate/core';
import {FiatCurrencySearchBarComponent} from './components/fiat-currency-search-bar.component';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ButtonModule, IconsModule, SelectModule, FiatCurrencySearchBarComponent]
})
export class SettingsComponent implements OnInit, OnDestroy {

  private _onDestroy: Subject<void> = new Subject<void>();

  public availableCurrencies: string[] = [];
  public availableLanguages: string[] = LanguageService.AvailableLanguages;
  public changeLanguageControl: UntypedFormControl = new UntypedFormControl(LanguageService.currentLang);

  public buildInfo = build;
  public environment = environment;
  public importStatus: string | null = null;

  @Output() onClose = new EventEmitter<void>();

  constructor(private store: PriceTrackerStore,
              private language: LanguageService,
              private fiat: FiatCurrencyService,
              private dataExport: DataExportService) {
  }

  ngOnInit(): void {
    this.fiat.availableCurrencies
      .pipe(take(1))
      .subscribe(availableCurrencies => {
        this.availableCurrencies = availableCurrencies.sort();
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

  public selectDisplayCurrency(symbol: string) {
    this.store.changeDisplayCurrency(symbol);
  }

  public exportData() {
    this.dataExport.exportToJson().subscribe(json => {
      const blob = new Blob([json], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pricetracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  public onImportFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = await this.dataExport.importFromJson(reader.result as string);
        this.store.reload();
        this.importStatus = `Importerade ${result.imported} rader. ✔️`;
      } catch (e) {
        this.importStatus = 'Import misslyckades: ' + (e as Error).message;
      }
    };
    reader.readAsText(file);
    // Återställ input så samma fil kan väljas igen
    input.value = '';
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


}
