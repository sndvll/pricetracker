import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from './shared';
import {HttpClientModule} from '@angular/common/http';
import {StateModule} from './core/store';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {TotalAmountModule} from './total-amount/total-amount.module';
import {AssetsModule} from './assets';
import {CryptoSearchbarModule} from './crypto-searchbar';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    TotalAmountModule,
    AssetsModule,
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

}
