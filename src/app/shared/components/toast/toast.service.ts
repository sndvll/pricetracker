import {Injectable} from '@angular/core';
import {
  DialogRef,
  DialogService,
  DialogType,
  DialogXPosition,
  DialogYPosition,
  GlobalDialogConfigBuilder,
} from '../../../core';
import {ToastComponent} from './toast.component';
import {ToastConfig, ToastType} from './toast.config';

const DEFAULT_CONFIG: ToastConfig = {
  x: DialogXPosition.Right,
  y: DialogYPosition.Top,
  type: ToastType.Info,
  time: 10
}

@Injectable({providedIn: 'root'})
export class ToastService {

  constructor(private dialog: DialogService) {}

  public open(config: ToastConfig = DEFAULT_CONFIG): DialogRef {
    return this.dialog.open<ToastComponent, ToastConfig>(ToastService
      .getDialogConfig(config));
  }

  private static getDialogConfig(config: ToastConfig) {
    const {type, time, x, y, message} = config;
    return new GlobalDialogConfigBuilder<ToastComponent>()
      .type(DialogType.Toast)
      .component(ToastComponent)
      .data({message, type, time})
      .isClosable(true)
      .position(x, y)
      .classes('m-3')
      .withBackdrop(false)
      .config;
    }
}
