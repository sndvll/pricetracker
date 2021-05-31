import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {AssetComponent} from "./components/asset.component";
import {TrackerPageComponent} from "./tracker-page.component";
import {TestComponent} from './components/test.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    TrackerPageComponent,
    AssetComponent,
    TestComponent
  ],
  exports: [
    TrackerPageComponent
  ]
})
export class TrackerModule {}
