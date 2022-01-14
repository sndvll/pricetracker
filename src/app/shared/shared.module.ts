import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconsModule} from './icons.module';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {
  ModalModule,
  ToastModule,
  ButtonModule,
  ProgressBarModule,
  AccordionModule,
  AlertModule,
  CardModule,
  DragNDropModule,
  DropdownMenuModule,
  InputModule,
  LoaderModule,
  SearchbarModule,
  ToggleModule,
  TooltipModule,
  SelectModule,
  TruncatePipeModule,
} from '@sndvll/components';
import {AmountChangePipe, AmountPipe} from './pipes';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ModalModule,
    IconsModule,
    ProgressBarModule,
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
    DragNDropModule,
    TruncatePipeModule
  ],
  declarations: [
    AmountChangePipe,
    AmountPipe,
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
    AlertModule,
    SearchbarModule,
    TranslateModule,
    LoaderModule,
    AmountPipe,
    DragNDropModule,
    TruncatePipeModule
  ]
})
export class SharedModule {
}
