import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {AssetBodyComponent, AssetHeaderComponent, AssetIconComponent, AssetListComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    AssetListComponent,
    AssetBodyComponent,
    AssetHeaderComponent,
    AssetIconComponent
  ],
  exports: [
    AssetListComponent,
    AssetBodyComponent,
    AssetHeaderComponent,
    AssetIconComponent
  ],
})
export class AssetListModule {}
