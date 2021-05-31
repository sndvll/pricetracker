import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Dialog, DialogBackdrop} from './dialog';
import {DialogService} from './dialog.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    Dialog,
    DialogBackdrop,
  ],
  providers: [
    DialogService
  ],
})
export class DialogModule {}
