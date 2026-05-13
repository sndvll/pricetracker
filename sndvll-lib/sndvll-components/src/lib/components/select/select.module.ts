import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectComponent} from './select.component';
import {IconsModule} from '../../icons.module';
import {SelectOptionComponent} from './select-option.component';
import {SelectDropdownComponent} from './select-dropdown.component';
import {SelectLabelDirective} from './select-label.directive';
import {InputModule} from '../input';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    InputModule
  ],
  declarations: [
    SelectComponent,
    SelectOptionComponent,
    SelectLabelDirective,
    SelectDropdownComponent
  ],
  exports: [
    SelectComponent,
    SelectOptionComponent,
    SelectLabelDirective
  ]
})
export class SelectModule {}
