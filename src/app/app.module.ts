import {Inject, NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from './shared';
import {HttpClientModule} from '@angular/common/http';
import {StateModule} from './core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {TotalAmountModule} from './total-amount/total-amount.module';
import {CryptoSearchbarModule} from './crypto-searchbar';
import {AssetListModule} from './assets-list';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DOCUMENT} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    TotalAmountModule,
    AssetListModule,
    CryptoSearchbarModule,
    HttpClientModule,
    StateModule.forRoot({
      enableDevTools: false
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private device: DeviceDetectorService,
              @Inject(DOCUMENT) private document: Document) {
    console.log('app initiating');

    // Check if app is on ios
    const mobileSafari = this.device.isMobile() && this.device.browser.toLowerCase() === 'safari';
    if (mobileSafari) {
      // If so add this attribute to the meta-element to prevent safari to zoom in on focused
      // inputs etc. hackityhack..
      const metaEl = this.document.querySelector('meta[name=viewport]')!;
      metaEl.setAttribute('content', "width=device-width, initial-scale=1, maximum-scale=1");
    }
  }

}
