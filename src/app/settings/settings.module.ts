import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';
import {SharedModule} from '../shared';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [SettingsComponent],
  exports: [SettingsComponent]
})
export class SettingsModule {}
