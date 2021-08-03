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
import {AddAssetModule} from './add-asset/add-asset.module';
import {CurrencyDetailsModule} from './currency-details/currency-details.module';
import {LanguageModule} from './core/language';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

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
    StateModule.forRoot({
      enableDevTools: true
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    LanguageModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([])
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
