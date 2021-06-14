import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastModule} from './components';
import {IconsModule} from './icons.module';
import {ModalModule} from './components';
import {ProgressBarModule} from './directives';
import {ReactiveFormsModule} from '@angular/forms';
import {InputModule} from './components';
import {ToggleModule} from './components';
import {DropdownMenuModule} from './components';
import {TooltipModule} from './components';
import {CardModule} from './components';
import {AmountChangePipe} from './pipes';
import {AccordionModule} from './components';
import {ButtonModule} from './directives';
import {AlertModule} from './components';
import {Select2Module} from './components';
import {SearchbarModule} from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ModalModule,
    IconsModule,
    ProgressBarModule,
    Select2Module,
    InputModule,
    ToggleModule,
    DropdownMenuModule,
    TooltipModule,
    CardModule,
    AccordionModule,
    ButtonModule,
    AlertModule,
    SearchbarModule
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
    Select2Module,
    InputModule,
    ToggleModule,
    DropdownMenuModule,
    TooltipModule,
    CardModule,
    AmountChangePipe,
    AccordionModule,
    ButtonModule,
    AlertModule,
    SearchbarModule
  ]
})
export class SharedModule {}
