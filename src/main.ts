import {enableProdMode, importProvidersFrom} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {LanguageModule, PersistenceModule} from '@sndvll/core';

import {AppComponent} from './app/app.component';
import {environment} from './environments/environment';
import {LANG_EN, LANG_SV} from './app/i18n';
import {PersistenceConfig} from './app/core/persistence/persistence.config';

const LanguageConfig = {
  languages: [
    {key: 'en', translations: {...LANG_EN}},
    {key: 'sv', translations: {...LANG_SV}},
  ]
};

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(PersistenceModule.forRoot(PersistenceConfig)),
    importProvidersFrom(LanguageModule.forRoot(LanguageConfig)),
    provideHttpClient(withInterceptorsFromDi()),
  ]
}).catch(err => console.error(err));
