import {ModuleWithProviders, NgModule} from '@angular/core';
import {StateConfig, STORE_CONFIG} from './state.config';
import {StateDevTools} from './state.dev-tools';

@NgModule({})
export class StateModule {

  static forRoot(stateConfig?: StateConfig): ModuleWithProviders<StateModule> {
    return {
      ngModule: StateModule,
      providers: [
        StateDevTools,
        {
          provide: STORE_CONFIG,
          useValue: stateConfig
        }
      ]
    }
  }
}
