import {Inject, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {LANGUAGE_CONFIG_INJECTION_TOKEN, LanguageConfig} from "./language.config";

@Injectable()
export class LanguageService {

  private currentLanguage: BehaviorSubject<string> = new BehaviorSubject<string>(LanguageService.currentLang);
  public currentLanguage$: Observable<string> = this.currentLanguage.asObservable();

  static AvailableLanguages: string[] = [];

  constructor(private translateService: TranslateService,
              @Inject(LANGUAGE_CONFIG_INJECTION_TOKEN) private config: LanguageConfig) {}

  public init(): void {
    const languages = this.config.languages;
    languages.forEach(language => {
      const {key, translations} = language;
      this.translateService.setTranslation(key, translations);
      LanguageService.AvailableLanguages.push(key);
    });
    const lang: string = <string>localStorage.getItem('lang') ?? languages[0].key;
    this.translateService.setDefaultLang(lang);
    this.setLanguage(lang);
  }

  public setLanguage(language: string): void {
    localStorage.setItem('lang', language)
    this.currentLanguage.next(language);
    this.translateService.use(language);
  }

  public translate(key: string) {
    return this.translateService.instant(key);
  }

  public static get currentLang(): string {
    // hmm todo. this is probably not good if there is no "en" language loaded
    return <string>localStorage.getItem('lang') || 'en';
  }
}
