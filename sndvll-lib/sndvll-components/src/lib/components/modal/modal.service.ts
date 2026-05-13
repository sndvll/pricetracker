import {Injectable} from '@angular/core';
import {
  OverlayConfig,
  OverlayRef,
  OverlayService,
  OverlayType,
  OverlayXPosition,
  OverlayYPosition,
  GlobalOverlayConfigBuilder
} from '@sndvll/core';
import {ModalComponent} from './modal.component';
import {ModalConfig, ModalType} from './modal.config';


@Injectable({providedIn: 'root'})
export class ModalService {

  constructor(private overlay: OverlayService) {}

  public open(config: ModalConfig): OverlayRef<ModalComponent, ModalConfig> {

    const modalTypeConfigs = {
      [ModalType.Floating]: ModalService.getOverlayConfig(config)
        .position(OverlayXPosition.Center, OverlayYPosition.Middle),
      [ModalType.Left]: ModalService.getOverlayConfig(config)
        .position(OverlayXPosition.Left, OverlayYPosition.Top)
        .fullHeight(true),
      [ModalType.Right]: ModalService.getOverlayConfig(config)
        .position(OverlayXPosition.Right, OverlayYPosition.Top)
        .fullHeight(true)
    };

    const OverlayConfig: OverlayConfig<ModalComponent, ModalConfig> = modalTypeConfigs[config.type].config;
    return this.overlay.open<ModalComponent, ModalConfig>(OverlayConfig);
  }

  private static getOverlayConfig(config: ModalConfig) {
    return new GlobalOverlayConfigBuilder<ModalComponent, ModalConfig>()
      .component(ModalComponent)
      .classes('w-96 max-w-xs')
      .data(config)
      .type(OverlayType.Modal)
      .isClosable(config.closable ?? true)
      .closeOnBackdropClick(config.closeOnBackdropClick ?? true)
      .withBackdrop(true)
      .backdropOpacity(config.backdropOpacity ?? '60')
      .backdropClass(config.backdropClass ?? 'bg-white dark:bg-gray-700')
      .noScroll(true)
  }
}
