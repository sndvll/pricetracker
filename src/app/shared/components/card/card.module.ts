import {NgModule} from '@angular/core';
import {CardComponent, CardContentDirective, CardFooterDirective, CardHeaderDirective} from './card';

@NgModule({
  declarations: [
    CardComponent,
    CardContentDirective,
    CardHeaderDirective,
    CardFooterDirective
  ],
  exports: [
    CardComponent,
    CardContentDirective,
    CardHeaderDirective,
    CardFooterDirective
  ]
})
export class CardModule {}
