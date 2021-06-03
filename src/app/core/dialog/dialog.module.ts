import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnectedDialog, GlobalDialog, DialogBackdrop} from './dialog';
import {DialogService} from './dialog.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    GlobalDialog,
    ConnectedDialog,
    DialogBackdrop
  ],
  providers: [
    DialogService
  ]
})
export class DialogModule {}
