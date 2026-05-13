import {InjectionToken} from "@angular/core";

export interface Language {
  key: string;
  translations: {
    [keys: string]: any;
  }
}

export interface LanguageConfig {
  languages: Language[];
}

export const LANGUAGE_CONFIG_INJECTION_TOKEN = new InjectionToken<LanguageConfig>('language_config')
