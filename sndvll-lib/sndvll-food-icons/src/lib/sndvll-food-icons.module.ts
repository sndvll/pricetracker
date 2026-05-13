import {ModuleWithProviders, NgModule, Optional} from '@angular/core';
import {FoodIcons} from './food-icons';
import {FoodIconComponent} from './food-icon.component';


@NgModule({
  declarations: [
    FoodIconComponent
  ],
  exports: [
    FoodIconComponent
  ]
})
export class SndvllFoodIconsModule {
  constructor(@Optional() private icons: FoodIcons) {
    if (!this.icons) {
      throw new Error('No icon provided, use Icons.pick({...}) when importing module');
    }
  }

  static pick(icons: { [keys: string]: string }): ModuleWithProviders<SndvllFoodIconsModule> {
    return {
      ngModule: SndvllFoodIconsModule,
      providers: [
        {provide: FoodIcons, multi: true, useValue: icons}
      ]
    }
  }
}
