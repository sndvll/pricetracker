import {Injectable} from '@angular/core';
import {DialogRef, DialogService, DialogType, GlobalDialogConfigBuilder} from '../../../core';
import {AlertComponent} from './alert.component';

export enum AlertType {
  Info = 'info',
  Warning = 'warning',
}

export interface AlertConfig<D = any> {
  type: AlertType;
  message: string;
  data?: D;
}

@Injectable({providedIn: 'root'})
export class AlertService {

  constructor(private dialog: DialogService) {}

  public open<D>(config: AlertConfig): DialogRef<AlertComponent<D>> {

    const dialogConfig = new GlobalDialogConfigBuilder<AlertComponent<D>, AlertConfig>()
      .data(config)
      .component(AlertComponent)
      .type(DialogType.Alert)
      .isClosable(true)
      .withBackdrop(true)
      .backdropOpacity('30')
      .backdropClass('bg-white dark:bg-gray-700')
      .noScroll(true)
      .config;

    return this.dialog.open<AlertComponent<D>, any>(dialogConfig);
  }
}
