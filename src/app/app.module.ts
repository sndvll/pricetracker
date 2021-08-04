import {Inject, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from './shared';
import {HttpClientModule} from '@angular/common/http';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {TotalAmountModule} from './total-amount';
import {CryptoSearchbarModule} from './crypto-searchbar';
import {AssetListModule} from './assets-list';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DOCUMENT} from '@angular/common';
import {AddAssetModule} from './add-asset';
import {CurrencyDetailsModule} from './currency-details';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {
  reducers,
  PriceTrackerEffects,
  LanguageModule
} from './core';

/*
DONE: Pull to refresh
  // Somewhat done, but needs to be combined with the loading feature
DONE: Loading
TODO: Settings
  - Select Language
  - Select Display Currency
  - Toggle polling ?
TODO: Splashscreen
TODO: Logo
DONE: Translations
  - Modules done (EN, SV), now just need to get rid of translate dependency to shared folder.
TODO: Look for a better label solution in alert component
 */

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
    AddAssetModule,
    CurrencyDetailsModule,
    CryptoSearchbarModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    LanguageModule,
    StoreModule.forRoot({
      priceTrackerState: reducers
    }, {

      runtimeChecks: {
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateImmutability: true,
        strictStateSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true
      }

    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([PriceTrackerEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private device: DeviceDetectorService,
              @Inject(DOCUMENT) private document: Document) {

    console.log('app initiating');
    const metaEl = this.document.querySelector('meta[name=viewport]')!;
    if (this.device.device.toLowerCase() === 'iphone' || this.document.defaultView!.matchMedia('(display-mode: standalone)').matches) {
      console.log('standalone/iphone mode.')
      // If device is iphone, or installed as a pwa add this attribute to the meta-element to prevent safari to zoom in on focused inputs etc.
      metaEl.setAttribute('content', "width=device-width, initial-scale=1, maximum-scale=1");
    } else {
      console.log('non iphone/browser mode')
      // this is is for other devices. On Android maximum-scale=1 disables zoom completely so if using the app
      // in the browser the user still have the ability to zoom in.
      metaEl.setAttribute('content', "width=device-width, initial-scale=1");
    }

  }

}
