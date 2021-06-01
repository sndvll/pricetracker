import {NgModule} from '@angular/core';
import {SndvllIconsModule} from '@sndvll/icons';
import {AlertCircle, AlertTriangle, Info, XCircle} from '@sndvll/icons/icons';

@NgModule({
  imports: [
    SndvllIconsModule.pick({
      AlertCircle,
      XCircle,
      AlertTriangle,
      Info
    })
  ],
  exports: [
    SndvllIconsModule
  ]
})
export class IconsModule {}
