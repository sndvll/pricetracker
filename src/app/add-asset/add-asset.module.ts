import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {AddAssetComponent} from './add-asset.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AddAssetComponent
  ]
})
export class AddAssetModule {}
