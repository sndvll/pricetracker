import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';
import {SharedModule} from '../shared';
import {FiatCurrencySearchBarComponent} from './components/fiat-currency-search-bar.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [SettingsComponent, FiatCurrencySearchBarComponent],
  exports: [SettingsComponent]
})
export class SettingsModule {}
