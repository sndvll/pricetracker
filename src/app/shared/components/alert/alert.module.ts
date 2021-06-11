import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from '../../directives/button/button.module';
import {AlertComponent} from './alert.component';
import {IconsModule} from '../../icons.module';
import {InputModule} from '../input/input.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ToggleModule} from '../toggle/toggle.module';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    IconsModule,
    InputModule,
    ReactiveFormsModule,
    ToggleModule
  ],
  declarations: [
    AlertComponent
  ]
})
export class AlertModule {}
