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
import {AmountChangePipe,AmountPipe} from './pipes';
import {AccordionModule} from './components';
import {ButtonModule} from './directives';
import {AlertModule} from './components';
import {Select2Module} from './components';
import {SearchbarModule} from './components';
import {TranslateModule} from '@ngx-translate/core';
import {LoaderModule} from './components/loader/loader.module';
import {TruncatePipe} from './pipes/truncate/truncate.pipe';
import {DragNDropModule} from './components/drag-drop/drag-drop.module';

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
    SearchbarModule,
    LoaderModule,
    DragNDropModule
  ],
  declarations: [
    AmountChangePipe,
    AmountPipe,
    TruncatePipe
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
    SearchbarModule,
    TranslateModule,
    LoaderModule,
    AmountPipe,
    TruncatePipe,
    DragNDropModule
  ]
})
export class SharedModule {}
