import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LANG_EN, LANG_SV} from '../../i18n';
import {BehaviorSubject, Observable} from 'rxjs';

export enum Language  {
  EN = 'en',
  SV = 'sv'
}

@Injectable()
export class LanguageService {

  private currentLanguage: BehaviorSubject<Language> = new BehaviorSubject<Language>(LanguageService.currentLang);
  public currentLanguage$: Observable<Language> = this.currentLanguage.asObservable();

  constructor(private translateService: TranslateService) {}

  public init(): void {
    this.translateService.setTranslation(Language.SV, LANG_SV);
    this.translateService.setTranslation(Language.EN, LANG_EN);
    const lang: Language = <Language>localStorage.getItem('lang') ?? Language.EN;
    this.translateService.setDefaultLang(lang);
    this.setLanguage(lang);
  }

  public setLanguage(language: Language): void {
    localStorage.setItem('lang', language)
    this.currentLanguage.next(language);
    this.translateService.use(language);
  }

  public translate(key: string) {
    return this.translateService.instant(key);
  }

  public static get currentLang(): Language {
    return <Language>localStorage.getItem('lang') || Language.EN;
  }

  public static get AvailableLanguages(): Language[] {
    return Object.values(Language);
  }



}
