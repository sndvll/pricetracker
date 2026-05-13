import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  AccordionComponent, AccordionItemComponent, AccordionItemContentComponent, AccordionItemHeaderComponent
} from './accordion.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AccordionComponent,
    AccordionItemComponent,
    AccordionItemHeaderComponent,
    AccordionItemContentComponent
  ],
  exports: [
    AccordionComponent,
    AccordionItemComponent,
    AccordionItemHeaderComponent,
    AccordionItemContentComponent
  ]
})
export class AccordionModule {}
