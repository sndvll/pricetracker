import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastModule} from './components/toast';
import {IconsModule} from './icons.module';
import {ModalModule} from './components/modal/modal.module';
import {ProgressBarModule} from './components/progress-bar/progress-bar.module';

@NgModule({
  imports: [
    CommonModule,
    ToastModule,
    ModalModule,
    IconsModule,
    ProgressBarModule
  ],
  declarations: [],
  exports: [
    ToastModule,
    ModalModule,
    IconsModule,
    ProgressBarModule
  ]
})
export class SharedModule {}
