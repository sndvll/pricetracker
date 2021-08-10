import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {AssetBodyComponent, AssetHeaderComponent, AssetIconComponent, AssetListComponent} from './components';
import {AssetListsComponent} from './asset-lists.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    AssetListsComponent,
    AssetListComponent,
    AssetBodyComponent,
    AssetHeaderComponent,
    AssetIconComponent
  ],
  exports: [
    AssetListsComponent
  ],
})
export class AssetListModule {}
