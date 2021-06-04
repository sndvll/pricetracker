import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from '../../../core/dialog';
import {SelectComponent} from './select.component';
import {IconsModule} from '../../icons.module';
import {SelectOptionComponent} from './select-option.component';
import {SelectDropdownComponent} from './select-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    IconsModule
  ],
  declarations: [
    SelectComponent,
    SelectDropdownComponent,
    SelectOptionComponent
  ],
  exports: [
    SelectComponent
  ]
})
export class SelectModule {}
