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
import {CardModule} from './components/card/card.module';
import {AmountChangePipe} from './pipes/amount-change.pipe';
import {AccordionModule} from './components/accordion/accordion.module';
import {ButtonModule} from './directives/button/button.module';
import {AlertModule} from './components/alert/alert.module';

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
    TooltipModule,
    CardModule,
    AccordionModule,
    ButtonModule,
    AlertModule
  ],
  declarations: [
    AmountChangePipe
  ],
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
    TooltipModule,
    CardModule,
    AmountChangePipe,
    AccordionModule,
    ButtonModule,
    AlertModule
  ]
})
export class SharedModule {}
