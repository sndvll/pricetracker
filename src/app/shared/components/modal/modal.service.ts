import {Injectable} from '@angular/core';
import {
  BackdropColor,
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

  open(config: ModalConfig) {

    const modalTypeConfigs = {
      [ModalType.Floating]: ModalService.getDialogConfig(config)
        .position(DialogXPosition.Center, DialogYPosition.Top)
        .classes('mt-24'),
      [ModalType.Left]: ModalService.getDialogConfig(config)
        .position(DialogXPosition.Left, DialogYPosition.Top)
        .fullHeight(true),
      [ModalType.Right]: ModalService.getDialogConfig(config)
        .position(DialogXPosition.Right, DialogYPosition.Top)
        .fullHeight(true)
    };

    const dialogConfig = modalTypeConfigs[config.type].config;
    return this.dialog.open(dialogConfig);
  }

  private static getDialogConfig(config: ModalConfig) {
    return new GlobalDialogConfigBuilder<ModalComponent, ModalConfig>()
      .component(ModalComponent)
      .data(config)
      .type(DialogType.Modal)
      .isClosable(true)
      .closeOnBackdropClick(config.closeOnBackdropClick ?? true)
      .withBackdrop(true)
      .backdropOpacity(config.backdropOpacity ?? '40')
      .backdropColor(config.backdropColor ?? BackdropColor.White)
      .noScroll(true)
  }
}
