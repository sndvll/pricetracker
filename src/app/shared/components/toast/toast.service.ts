import {Injectable} from '@angular/core';
import {
  DialogRef,
  DialogService,
  DialogXPosition,
  GlobalDialogConfigBuilder,
} from '../../../core';
import {ToastComponent} from './toast.component';
import {ToastConfig, ToastType} from './toast.config';

const DEFAULT_CONFIG: ToastConfig = {
  position: DialogXPosition.Center,
  type: ToastType.Info,
  time: 10
}

@Injectable({providedIn: 'root'})
export class ToastService {

  constructor(private dialog: DialogService) {}

  public open(config: ToastConfig = DEFAULT_CONFIG): DialogRef {

    const {type, time, position, message} = config;

    const dialogConfig = GlobalDialogConfigBuilder.toast<ToastComponent>(position)
      .component(ToastComponent)
      .data({message, type, time})
      .config;

    return this.dialog.open<ToastComponent, ToastConfig>(dialogConfig);
  }
}
