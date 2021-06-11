import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponent, ModalContentDirective, ModalFooterDirective, ModalHeaderDirective} from './modal.component';
import {IconsModule} from '../../icons.module';
import {ButtonModule} from '../../directives/button/button.module';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ButtonModule
  ],
  declarations: [
    ModalComponent,
    ModalHeaderDirective,
    ModalContentDirective,
    ModalFooterDirective
  ],
  exports: [
    ModalHeaderDirective,
    ModalContentDirective,
    ModalFooterDirective
  ]
})
export class ModalModule {}
