import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastModule} from './components/toast';
import {IconsModule} from './icons.module';
import {ModalModule} from './components/modal';
import {ProgressBarModule} from './directives/progress-bar';
import {ReactiveFormsModule} from '@angular/forms';
import {InputModule} from './components/input';
import {ToggleModule} from './components/toggle';
import {DropdownMenuModule} from './components/dropdown-menu';
import {TooltipModule} from './components/tooltip';
import {CardModule} from './components/card';
import {AmountChangePipe} from './pipes';
import {AccordionModule} from './components/accordion';
import {ButtonModule} from './directives/button';
import {AlertModule} from './components/alert';
import {Select2Module} from './components/select';
import {SearchbarModule} from './components/searchbar';

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
