import {NgModule} from '@angular/core';
import {SndvllIconsModule} from '@sndvll/icons';
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp, Edit, ExternalLink, Globe, HelpCircle,
  Info, List, Menu,
  MoreVertical,
  PlusCircle, Search, Settings, Trash2,
  X,
  XCircle,
} from '@sndvll/icons/icons';

const icons = {
  AlertCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  PlusCircle,
  Menu,
  Settings,
  Edit,
  Trash2,
  List,
  Globe,
  ExternalLink,
  Search
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
