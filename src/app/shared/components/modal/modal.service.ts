import {Injectable} from '@angular/core';
import {
  DialogConfig,
  DialogRef,
  DialogService,
  DialogType,
  DialogXPosition,
  DialogYPosition,
  GlobalDialogConfigBuilder
} from '../../../core/dialog';
import {ModalComponent} from './modal.component';
import {ModalConfig, ModalType} from './modal.config';


@Injectable({providedIn: 'root'})
export class ModalService {

  constructor(private dialog: DialogService) {}

  open(config: ModalConfig): DialogRef<ModalComponent, ModalConfig> {

    const modalTypeConfigs = {
      [ModalType.Floating]: ModalService.getDialogConfig(config)
        .position(DialogXPosition.Center, DialogYPosition.Middle),
      [ModalType.Left]: ModalService.getDialogConfig(config)
        .position(DialogXPosition.Left, DialogYPosition.Top)
        .fullHeight(true),
      [ModalType.Right]: ModalService.getDialogConfig(config)
        .position(DialogXPosition.Right, DialogYPosition.Top)
        .fullHeight(true)
    };

    const dialogConfig: DialogConfig<ModalComponent, ModalConfig> = modalTypeConfigs[config.type].config;
    return this.dialog.open<ModalComponent, ModalConfig>(dialogConfig);
  }

  private static getDialogConfig(config: ModalConfig) {
    return new GlobalDialogConfigBuilder<ModalComponent, ModalConfig>()
      .component(ModalComponent)
      .classes('w-96 max-w-xs')
      .data(config)
      .type(DialogType.Modal)
      .isClosable(config.closable ?? true)
      .closeOnBackdropClick(config.closeOnBackdropClick ?? true)
      .withBackdrop(true)
      .backdropOpacity(config.backdropOpacity ?? '60')
      .backdropClass(config.backdropClass ?? 'bg-white dark:bg-gray-700')
      .noScroll(true)
  }
}
