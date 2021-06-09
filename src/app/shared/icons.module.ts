import {NgModule} from '@angular/core';
import {SndvllIconsModule} from '@sndvll/icons';
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp, Edit,
  Info, Menu,
  MoreVertical,
  PlusCircle, Settings, Trash2,
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
  MoreVertical,
  PlusCircle,
  Menu,
  Settings,
  Edit,
  Trash2
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
