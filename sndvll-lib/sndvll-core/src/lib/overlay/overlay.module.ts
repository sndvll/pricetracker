import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnectedOverlay, GlobalOverlay, OverlayBackdrop} from './overlay';
import {OverlayService} from './overlay.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    GlobalOverlay,
    ConnectedOverlay,
    OverlayBackdrop
  ],
  providers: [
    OverlayService
  ]
})
export class OverlayModule {}
