import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {CurrencyDetailsComponent} from './currency-details.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartCardComponent} from './components/chart-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule
  ],
  declarations: [
    CurrencyDetailsComponent,
    ChartCardComponent
  ]
})
export class CurrencyDetailsModule {}
