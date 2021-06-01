import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from './shared';
import {TrackerModule} from './tracker/tracker.module';
import {HttpClientModule} from '@angular/common/http';
import {StateModule} from './core/state';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    TrackerModule,
    HttpClientModule,
    StateModule.forRoot({
      enableDevTools: true
    }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
