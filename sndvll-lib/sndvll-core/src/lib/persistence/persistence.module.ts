import {Inject, ModuleWithProviders, NgModule, Optional} from "@angular/core";
import {PERSISTENCE_CONFIG_INJECTION_TOKEN, PersistenceConfig} from "./persistence.config";

@NgModule({})
export class PersistenceModule {

  constructor(@Optional() @Inject(PERSISTENCE_CONFIG_INJECTION_TOKEN) private config: PersistenceConfig) {
    if (!this.config) {
      throw new Error('No config provided, use forRoot({...}) when importing module');
    }
  }

  static forRoot(config: PersistenceConfig): ModuleWithProviders<PersistenceModule> {
    return {
      ngModule: PersistenceModule,
      providers: [
        {provide: PERSISTENCE_CONFIG_INJECTION_TOKEN, useValue: config}
      ]
    }
  }
}
