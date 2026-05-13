import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';
import {FiatCurrencySearchBarComponent} from './components/fiat-currency-search-bar.component';
import {SharedModule} from '../shared';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SettingsComponent,
    FiatCurrencySearchBarComponent,
  ],
  exports: [SettingsComponent]
})
export class SettingsModule {}
