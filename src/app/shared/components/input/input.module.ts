import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputComponent} from './input.component';
import {IconsModule} from '../../icons.module';

@NgModule({
  imports: [
    CommonModule,
    IconsModule
  ],
  declarations: [
    InputComponent
  ],
  exports: [
    InputComponent
  ]
})
export class InputModule {}
