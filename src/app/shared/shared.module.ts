import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastModule} from './components/toast';
import {IconsModule} from './icons.module';
import {ModalModule} from './components/modal/modal.module';
import {ProgressBarModule} from './components/progress-bar/progress-bar.module';
import {SelectModule} from './components/select/select.module';
import {ReactiveFormsModule} from '@angular/forms';
import {InputModule} from './components/input/input.module';
import {ToggleModule} from './components/toggle/toggle.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ModalModule,
    IconsModule,
    ProgressBarModule,
    SelectModule,
    InputModule,
    ToggleModule
  ],
  declarations: [],
  exports: [
    ReactiveFormsModule,
    ToastModule,
    ModalModule,
    IconsModule,
    ProgressBarModule,
    SelectModule,
    InputModule,
    ToggleModule
  ]
})
export class SharedModule {}
