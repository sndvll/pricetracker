import {NgModule} from '@angular/core';
import {SndvllIconsModule} from '@sndvll/icons';
import {AlertCircle, AlertTriangle, ChevronDown, ChevronUp, Info, X, XCircle} from '@sndvll/icons/icons';

@NgModule({
  imports: [
    SndvllIconsModule.pick({
      AlertCircle,
      XCircle,
      AlertTriangle,
      Info,
      X,
      ChevronDown,
      ChevronUp
    })
  ],
  exports: [
    SndvllIconsModule
  ]
})
export class IconsModule {}
