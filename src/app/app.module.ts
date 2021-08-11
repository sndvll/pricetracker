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
import {SettingsModule} from './settings';

/*
DONE: Pull to refresh
DONE: Loading
DONE: Translations
DONE Settings
  - DONE Select Language
  - Select Display Currency
    - DONE add selector with available currencies
    - DONE Listen to changes and calculate correct amount
    - DONE labels to currencies
DONE: Currency Pipe with proper formatting and symbols
DONE Look for a better label solution in alert component
  - went back to having dependency on translate pipe in alert, also removed the input type of alert. now only warnings (with action)
    and info alerts are available.
  - DONE use modals for where input is needed, and remove the "input" type alert (closes the asset settings task as well).
DONE Asset settings
  - create one modal template instead of the alerts that is now
FIXED BUG - Look up why the modal cant have backdrop when closed and loading is showed.
  - solution: no backdrop on loader, handle background that in the loader component instead
DONE Collapse lists
DONE Header, where total amount is showed.
DONE Persist collapsed value
DONE App Icons
DONE Splashscreen (npx pwa-asset-generator ftw)
DONE Logo

TODO: Github Pages Deploy ()

TODO BUG! -> Search should work with symbols.
TODO BUG! -> When changing order, two list can have the same value. Fix that in effect so it cant happen.
TODO BUG! -> When new database initialized, hide total amount component

TODO: TESTS!

TODO: Desktop layout

TODO Improvement: Animations
  - modal fade ins
TODO Feature: New User guide
  - Stepper component
  - Images and descriptions
  - Show again, from settings.
TODO Feature: List order
  DONE set order manually
  - drag n drop
TODO Feature: Add asset positions

 */

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    TotalAmountModule,
    AssetListModule,
    AddAssetModule,
    SettingsModule,
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
