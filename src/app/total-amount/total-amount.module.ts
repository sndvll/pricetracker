import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {TotalAmountComponent} from './total-amount.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TotalAmountComponent
  ],
  exports: [
    TotalAmountComponent
  ]
})
export class TotalAmountModule {}
