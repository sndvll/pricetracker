import {Injectable} from '@angular/core';
import {OverlayRef, OverlayService, OverlayType, GlobalOverlayConfigBuilder} from '@sndvll/core';
import {AlertComponent} from './alert.component';
import {AlertConfig} from "./alert.config";



@Injectable({providedIn: 'root'})
export class AlertService {

  constructor(private overlay: OverlayService) {}

  public open<D>(config: AlertConfig): OverlayRef<AlertComponent<D>> {

    const OverlayConfig = new GlobalOverlayConfigBuilder<AlertComponent<D>, AlertConfig>()
      .data(config)
      .component(AlertComponent)
      .type(OverlayType.Alert)
      .isClosable(true)
      .withBackdrop(true)
      .backdropOpacity('30')
      .backdropClass('bg-white dark:bg-gray-700')
      .noScroll(true)
      .config;

    return this.overlay.open<AlertComponent<D>, any>(OverlayConfig);
  }
}
