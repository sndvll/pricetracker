import {InjectionToken, Type} from '@angular/core';

export enum DialogType {
  Full = 'full',
  Modal = 'modal',
  Toast = 'toast',
  Connected = 'connected'
}

export enum DialogXPosition {
  Center = 'center',
  Left = 'left',
  Right = 'right'
}

export enum DialogYPosition {
  Middle = 'middle',
  Top = 'top',
  Bottom = 'bottom',
}

export enum BackdropColor {
  White = 'white',
  Black = 'black',
  Transparent = 'transparent'
}

export const DIALOG_REF = new InjectionToken<any>('DIALOG_REF');

export interface DialogConfig<T, D = any> {
  origin?: HTMLElement;
  data?: D;
  component?: Type<T>,
  type?: DialogType;
  classes?: string;
  closable?: boolean;
  closeOnNavChange?: boolean;
  withBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  x?: DialogXPosition;
  y?: DialogYPosition;
  fullWidth?: boolean;
  fullHeight?: boolean;
  backdropClickThrough?: boolean;
  backdropColor?: BackdropColor;
}

abstract class DialogConfigBuilder<T, D = any> {
  abstract _config: DialogConfig<T>

  component(component: Type<T>) {
    this._config.component = component;
    return this;
  }

  classes(classes: string) {
    this._config.classes = classes;
    return this;
  }

  get config(): DialogConfig<T> {
    if (!this._config.component) {
      throw new Error('You need to provide a component to inject into the dialog');
    }
    return this._config;
  }
}

export class GlobalDialogConfigBuilder<T, D = any> extends DialogConfigBuilder<T, D>{

  _config: DialogConfig<T, D> = {
    type: DialogType.Modal,
    x: DialogXPosition.Center,
    y: DialogYPosition.Middle,
    fullHeight: false,
    fullWidth: false,
    classes: '',
    closable: true,
    closeOnNavChange: true,
    withBackdrop: true,
    closeOnBackdropClick: true,
    backdropClickThrough: false,
    backdropColor: BackdropColor.Black
  }

  data(data: D): GlobalDialogConfigBuilder<T> {
    this._config.data = data;
    return this;
  }

  type(type: DialogType) {
    this._config.type = type;
    return this;
  }

  position(x: DialogXPosition, y: DialogYPosition) {
    this._config.x = x;
    this._config.y = y;
    return this;
  }

  closeOnNavigationChange(close: boolean) {
    this._config.closeOnNavChange = close;
    return this;
  }

  isClosable(closable: boolean) {
    this._config.closable = closable;
    return this;
  }

  fullWidth(fullWidth: boolean) {
    this._config.fullWidth = fullWidth;
    return this;
  }

  fullHeight(fullHeight: boolean) {
    this._config.fullHeight = fullHeight;
    return this;
  }

  closeOnBackdropClick(close: boolean) {
    this._config.closeOnBackdropClick = close;
    return this;
  }

  backdropColor(color: BackdropColor) {
    this._config.backdropColor = color;
    return this;
  }

  backdropClickThrough(clickTrough: boolean) {
    this._config.backdropClickThrough = clickTrough;
    return this;
  }

  withBackdrop(withBackdrop: boolean) {
    this._config.withBackdrop = withBackdrop;
    return this;
  }

  static toast<T>(x: DialogXPosition): GlobalDialogConfigBuilder<T> {
    return new GlobalDialogConfigBuilder<T>()
      .type(DialogType.Toast)
      .isClosable(true)
      .position(x, DialogYPosition.Top)
      .classes('m-3')
      .withBackdrop(false)
      .backdropColor(BackdropColor.Transparent);
  }
}

export class ConnectedDialogConfigBuilder<T> extends DialogConfigBuilder<T> {

  _config: DialogConfig<T> = {
    type: DialogType.Connected,
    closable: true,
    closeOnNavChange: true,
    withBackdrop: true,
    closeOnBackdropClick: true,
    classes: ''
  };

  origin(origin: HTMLElement): ConnectedDialogConfigBuilder<T> {
    this._config.origin = origin;
    return this;
  }
}
