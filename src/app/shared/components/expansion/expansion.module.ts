import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExpansionBodyComponent, ExpansionComponent, ExpansionHeaderComponent} from './expansion.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ExpansionComponent,
    ExpansionHeaderComponent,
    ExpansionBodyComponent
  ],
  exports: [
    ExpansionComponent,
    ExpansionHeaderComponent,
    ExpansionBodyComponent
  ]
})
export class ExpansionModule {}
