import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from '../../../core/dialog';
import {ToastComponent} from './toast.component';
import {IconsModule} from '../../icons.module';
import {ProgressBarModule} from '../progress-bar/progress-bar.module';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    IconsModule,
    ProgressBarModule
  ],
  declarations: [
    ToastComponent,
  ]
})
export class ToastModule {}
