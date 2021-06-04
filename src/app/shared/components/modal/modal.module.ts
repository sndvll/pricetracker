import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from '../../../core/dialog';
import {ModalComponent} from './modal.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule
  ],
  declarations: [
    ModalComponent
  ],
  exports: []
})
export class ModalModule {}
