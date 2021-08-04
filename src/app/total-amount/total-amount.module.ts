import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {TotalAmountComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    TotalAmountComponent
  ],
  exports: [
    TotalAmountComponent
  ]
})
export class TotalAmountModule {}
