import {ModuleWithProviders, NgModule, Optional} from '@angular/core';
import {IconComponent} from './icon.component';
import {Icons} from './icons';

@NgModule({
  declarations: [
    IconComponent
  ],
  exports: [
    IconComponent
  ]
})
export class SndvllIconsModule {
  constructor(@Optional() private icons: Icons) {
    if (!this.icons) {
      throw new Error('No icon provided, use Icons.pick({...}) when importing module');
    }
  }

  static pick(icons: { [keys: string]: string }): ModuleWithProviders<SndvllIconsModule> {
    return {
      ngModule: SndvllIconsModule,
      providers: [
        {provide: Icons, multi: true, useValue: icons}
      ]
    }
  }
}
