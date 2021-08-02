import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LANG_EN, LANG_SV} from '../../i18n';

@Injectable()
export class LanguageService {

  constructor(private translate: TranslateService) {}

  public init(): void {
    this.translate.setTranslation('sv', LANG_SV);
    this.translate.setTranslation('en', LANG_EN);
    const lang = localStorage.getItem('lang') ?? 'en';
    this.translate.setDefaultLang(lang);
    this.setLanguage(lang);
  }

  public setLanguage(language: string): void {
    localStorage.setItem('lang', language)
    this.translate.use(language);
  }

  public get currentLang(): string {
    return this.translate.currentLang;
  }

}
