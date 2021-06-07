import {NgModule} from '@angular/core';
import {SndvllIconsModule} from '@sndvll/icons';
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  MoreVertical,
  X,
  XCircle,
} from '@sndvll/icons/icons';

const icons = {
  AlertCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  MoreVertical
};

@NgModule({
  imports: [
    SndvllIconsModule.pick(icons)
  ],
  exports: [
    SndvllIconsModule
  ]
})
export class IconsModule {}
