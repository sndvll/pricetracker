import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponent, ModalContentDirective, ModalHeaderDirective} from './modal.component';
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
    ModalContentDirective
  ],
  exports: [
    ModalHeaderDirective,
    ModalContentDirective
  ]
})
export class ModalModule {}
