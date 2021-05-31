import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from "./shared/shared.module";
import {TrackerModule} from "./tracker/tracker.module";
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    TrackerModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
