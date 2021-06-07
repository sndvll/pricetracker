import {InjectionToken, Type} from '@angular/core';
import {Opacity} from '../utils';

export enum DialogType {
  Full = 'full',
  Modal = 'modal',
  Toast = 'toast',
  Connected = 'connected'
}

export enum DialogConnectedPosition {
  TopLeft = 'top-left',
  TopMiddle = 'top-middle',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
  BottomMiddle = 'bottom-middle',
  Left = 'left',
  Right = 'right'
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

export  interface RepositionEvent {
  elementRect: DOMRect;
  position: DialogConnectedPosition;
  parentWide?: boolean;
}


export const DIALOG_REF = new InjectionToken<any>('DIALOG_REF');

export interface DialogConfig<T, D = any> {
  origin?: HTMLElement;
  data?: D;
  component?: Type<T>,
  type?: DialogType;
  classes?: string;
  closable?: boolean;
  closeOnNavigationChange?: boolean;
  withBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  x?: DialogXPosition;
  y?: DialogYPosition;
  fullWidth?: boolean;
  fullHeight?: boolean;
  backdropClickThrough?: boolean;
  backdropClass?: string;
  backdropOpacity?: Opacity;
  preferredConnectedPosition?: DialogConnectedPosition;
  parentWide?: boolean;
  noScroll?: boolean;
}

abstract class DialogConfigBuilder<T, D = any> {

  abstract _config: DialogConfig<T>;

  data(data: D) {
    this._config.data = data;
    return this;
  }

  component(component: Type<T>) {
    this._config.component = component;
    return this;
  }

  classes(classes: string) {
    this._config.classes = classes;
    return this;
  }

  withBackdrop(withBackdrop: boolean) {
    this._config.withBackdrop = withBackdrop;
    return this;
  }

  backdropClass(color: string) {
    this._config.backdropClass = color;
    return this;
  }

  backdropOpacity(opacity: Opacity) {
    this._config.backdropOpacity = opacity;
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
    closeOnNavigationChange: true,
    withBackdrop: true,
    closeOnBackdropClick: true,
    backdropClickThrough: false,
    backdropClass: 'bg-black'
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
    this._config.closeOnNavigationChange = close;
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

  backdropClickThrough(clickTrough: boolean) {
    this._config.backdropClickThrough = clickTrough;
    return this;
  }

  noScroll(noScroll: boolean) {
    this._config.noScroll = noScroll;
    return this;
  }
}

export class ConnectedDialogConfigBuilder<T, D> extends DialogConfigBuilder<T, D> {

  _config: DialogConfig<T> = {
    type: DialogType.Connected,
    closable: true,
    closeOnNavigationChange: true,
    withBackdrop: true,
    closeOnBackdropClick: true,
    preferredConnectedPosition: DialogConnectedPosition.BottomLeft,
    parentWide: false,
    classes: '',
    backdropOpacity: '30',
    backdropClass: 'bg-white dark:bg-black'
  };

  origin(origin: HTMLElement) {
    this._config.origin = origin;
    return this;
  }

  parentWide(parentWide: boolean) {
    this._config.parentWide = parentWide;
    return this;
  }

  preferredConnectedPosition(position: DialogConnectedPosition) {
    this._config.preferredConnectedPosition = position;
    return this;
  }
}
