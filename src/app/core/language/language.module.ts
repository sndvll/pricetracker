import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {LanguageService} from './language.service';

@NgModule({
  imports: [TranslateModule.forRoot()],
  providers: [LanguageService],
  exports: [TranslateModule]
})
export class LanguageModule {
  constructor(private language: LanguageService) {
    language.init();
  }
}
