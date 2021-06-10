import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {AssetListComponent} from './components/asset-list.component';
import {AssetBodyComponent} from './components/asset-body.component';
import {AssetHeaderComponent} from './components/asset-header.component';
import {AssetIconComponent} from './components/asset-icon.component';

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
export class AssetsModule {}
