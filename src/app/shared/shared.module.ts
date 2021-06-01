import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from '../core/dialog';
import {ToastModule} from './components/toast';
import {IconsModule} from './icons.module';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    ToastModule,
    IconsModule
  ],
  declarations: [],
  exports: [
    ToastModule,
    IconsModule
  ]
})
export class SharedModule {}
