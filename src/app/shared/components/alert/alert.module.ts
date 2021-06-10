import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from '../../directives/button/button.module';
import {AlertComponent} from './alert.component';
import {IconsModule} from '../../icons.module';
import {InputModule} from '../input/input.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    IconsModule,
    InputModule,
    ReactiveFormsModule
  ],
  declarations: [
    AlertComponent
  ]
})
export class AlertModule {}
