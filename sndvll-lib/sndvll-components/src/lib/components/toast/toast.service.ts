import {Injectable} from '@angular/core';
import {
  OverlayRef,
  OverlayService,
  OverlayType,
  OverlayXPosition,
  OverlayYPosition,
  GlobalOverlayConfigBuilder,
} from '@sndvll/core';
import {ToastComponent} from './toast.component';
import {ToastConfig, ToastType} from './toast.config';

const DEFAULT_CONFIG: ToastConfig = {
  x: OverlayXPosition.Center,
  y: OverlayYPosition.Top,
  type: ToastType.Info,
  time: 10
}

@Injectable({providedIn: 'root'})
export class ToastService {

  constructor(private overlay: OverlayService) {}

  public open(config: Partial<ToastConfig>): OverlayRef<ToastComponent, ToastConfig> {
    config = {...DEFAULT_CONFIG, ...config};
    return this.overlay.open<ToastComponent, ToastConfig>(ToastService
      .getOverlayConfig(config));
  }

  private static getOverlayConfig(config: Partial<ToastConfig>) {
    const {type, time, x, y, message} = config;
    return new GlobalOverlayConfigBuilder<ToastComponent>()
      .type(OverlayType.Toast)
      .component(ToastComponent)
      .data({message, type, time})
      .isClosable(true)
      .position(x!, y!)
      .classes('m-3')
      .withBackdrop(false)
      .config;
    }
}
