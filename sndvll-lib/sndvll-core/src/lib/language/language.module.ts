import {ModuleWithProviders, NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {LanguageService} from './language.service';
import {LANGUAGE_CONFIG_INJECTION_TOKEN, LanguageConfig} from "./language.config";

@NgModule({
  imports: [TranslateModule.forRoot()],
  providers: [LanguageService],
  exports: [TranslateModule]
})
export class LanguageModule {
  constructor(private language: LanguageService) {
    language.init();
  }
  static forRoot(config: LanguageConfig): ModuleWithProviders<LanguageModule> {
    return {
      ngModule: LanguageModule,
      providers: [
        {provide: LANGUAGE_CONFIG_INJECTION_TOKEN, useValue: config}
      ]
    }
  }
}
