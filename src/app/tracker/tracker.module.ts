import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared";
import {AssetComponent} from "./components/asset.component";
import {TrackerPageComponent} from "./tracker-page.component";
import {StateModule} from '../core/state';
import {AssetStore} from './store';
import {TestComponent} from './components/test.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StateModule
  ],
  declarations: [
    TrackerPageComponent,
    AssetComponent,
    TestComponent
  ],
  providers: [
    AssetStore
  ],
  exports: [
    TrackerPageComponent
  ]
})
export class TrackerModule {}
