import {SndvllIconsModule} from '@sndvll/icons';
import {NgModule} from "@angular/core";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Search,
  X
} from "@sndvll/icons/icons";

/*
These are the icons used by the component lib.
 */
const icons = {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Search,
  X
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
