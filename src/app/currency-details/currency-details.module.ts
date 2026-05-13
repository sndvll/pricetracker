import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartCardComponent, CurrencyDetailsComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    CurrencyDetailsComponent,
    ChartCardComponent
  ]
})
export class CurrencyDetailsModule {}
