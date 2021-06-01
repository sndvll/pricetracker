import {InjectionToken} from '@angular/core';

export enum DialogType {
  Full = 'full',
  Modal = 'modal',
  Toast = 'toast'
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

export interface DialogConfig<D = any> {
  data: D,
  type: DialogType;
  xPosition: DialogXPosition;
  yPosition: DialogYPosition;
  closeOnNavChange: boolean,
  closable: boolean;
  classes: string;
  fullWidth: boolean;
  fullHeight: boolean;
  closeOnBackdropClick: boolean;
  backdropColor: BackdropColor;
  backdropClickThrough: boolean;
  withBackdrop: boolean;
}

export const DIALOG_REF = new InjectionToken<any>('DIALOG_REF');
export const DIALOG_DATA = new InjectionToken<any>('DIALOG_DATA');

export class DialogConfigBuilder<D> {

  private _config: Partial<DialogConfig<D>> = {};

  data(data: D): DialogConfigBuilder<D> {
    this._config.data = data;
    return this;
  }

  type(type: DialogType) {
    this._config.type = type;
    return this;
  }

  position(x: DialogXPosition, y: DialogYPosition) {
    this._config.xPosition = x;
    this._config.yPosition = y;
    return this;
  }

  closeOnNav(close: boolean) {
    this._config.closeOnNavChange = close;
    return this;
  }

  isClosable(closable: boolean) {
    this._config.closable = closable;
    return this;
  }

  classes(classes: string) {
    this._config.classes = classes;
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

  config() {
    return this._config;
  }

  static Default(): Partial<DialogConfig> {
    return new DialogConfigBuilder()
      .type(DialogType.Modal)
      .position(DialogXPosition.Center, DialogYPosition.Middle)
      .isClosable(true)
      .closeOnNav(true)
      .backdropColor(BackdropColor.Black)
      .closeOnBackdropClick(true)
      .backdropClickThrough(false)
      .withBackdrop(true)
      .data(null)
      .config();
  }

  static full<D>(data?: D, closable = true): Partial<DialogConfig> {
    return new DialogConfigBuilder()
      .type(DialogType.Full)
      .isClosable(closable)
      .withBackdrop(false)
      .config();
  }

  static toast<C>(x: DialogXPosition): DialogConfigBuilder<C> {
    return new DialogConfigBuilder<C>()
      .type(DialogType.Toast)
      .isClosable(true)
      .backdropClickThrough(true)
      .position(x, DialogYPosition.Top)
      .classes('m-3')
      .withBackdrop(false)
      .backdropColor(BackdropColor.Transparent);
  }
}
