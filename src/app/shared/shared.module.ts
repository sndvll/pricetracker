import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastModule} from './components/toast';
import {IconsModule} from './icons.module';
import {ModalModule} from './components/modal/modal.module';
import {ProgressBarModule} from './directives/progress-bar/progress-bar.module';
import {SelectModule} from './components/select/select.module';
import {ReactiveFormsModule} from '@angular/forms';
import {InputModule} from './components/input/input.module';
import {ToggleModule} from './components/toggle/toggle.module';
import {DropdownMenuModule} from './components/dropdown-menu/dropdown-menu.module';
import {TooltipModule} from './components/tooltip/tooltip.module';

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
    ToggleModule,
    DropdownMenuModule,
    TooltipModule
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
    ToggleModule,
    DropdownMenuModule,
    TooltipModule
  ]
})
export class SharedModule {}
