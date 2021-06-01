import {Injectable} from '@angular/core';
import {
  DialogConfigBuilder,
  DialogRef,
  DialogService,
  DialogXPosition,
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

  public open(message: string, config: Omit<ToastConfig, 'message'> = DEFAULT_CONFIG): DialogRef {

    const {type, time, position} = config;

    const dialogConfig = DialogConfigBuilder
      .toast<Omit<ToastConfig, 'position'>>(position)
      .data({message, type, time})
      .config();

    return this.dialog.open(ToastComponent, dialogConfig);
  }
}
