import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from '../../../core/dialog';
import {ToastComponent} from './toast.component';
import {IconsModule} from '../../icons.module';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    IconsModule
  ],
  declarations: [
    ToastComponent
  ],
  providers: [],
  exports: []
})
export class ToastModule {}
