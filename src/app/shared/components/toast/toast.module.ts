import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastComponent} from './toast.component';
import {IconsModule} from '../../icons.module';
import {ProgressBarModule} from '../../directives/progress-bar/progress-bar.module';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ProgressBarModule
  ],
  declarations: [
    ToastComponent,
  ]
})
export class ToastModule {}
