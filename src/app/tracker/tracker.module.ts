import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared";
import {TrackerPageComponent} from "./tracker-page.component";
import {StateModule} from '../core/state';
import {AssetStore} from './store';
import {ButtonModule} from '../shared/directives/button/button.module';
import {TotalAmountComponent} from './components/total-amount.component';
import {AssetIconComponent} from './components/asset-icon.component';
import {AssetListComponent} from './components/asset-list.component';
import {AssetHeaderComponent} from './components/asset/asset-header.component';
import {AssetBodyComponent} from './components/asset/asset-body.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StateModule,
    ButtonModule
  ],
  declarations: [
    TrackerPageComponent,
    TotalAmountComponent,
    AssetHeaderComponent,
    AssetBodyComponent,
    AssetIconComponent,
    AssetListComponent
  ],
  providers: [
    AssetStore
  ],
  exports: [
    TrackerPageComponent
  ]
})
export class TrackerModule {}
