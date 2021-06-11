import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectComponent} from './select.component';
import {IconsModule} from '../../icons.module';
import {SelectOptionComponent} from './select-option.component';
import {SelectDropdownComponent} from './select-dropdown.component';
import {SelectLabelDirective} from './select-label.directive';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
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
export class Select2Module {}
