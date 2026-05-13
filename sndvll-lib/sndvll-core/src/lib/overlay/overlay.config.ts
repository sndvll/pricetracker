import {InjectionToken, Type} from '@angular/core';
import {Opacity} from '../utils';

export enum OverlayType {
  Full = 'full',
  Modal = 'modal',
  Toast = 'toast',
  Connected = 'connected',
  Alert = 'alert'
}

export enum OverlayConnectedPosition {
  TopLeft = 'top-left',
  TopMiddle = 'top-middle',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
  BottomMiddle = 'bottom-middle',
  Left = 'left',
  Right = 'right'
}

export enum OverlayXPosition {
  Center = 'center',
  Left = 'left',
  Right = 'right'
}

export enum OverlayYPosition {
  Middle = 'middle',
  Top = 'top',
  Bottom = 'bottom',
}

export interface RepositionEvent {
  elementRect: DOMRect;
  position: OverlayConnectedPosition;
  parentWide?: boolean;
}

export const OVERLAY_REF = new InjectionToken<any>('OVERLAY_REF');

export interface OverlayConfig<T, D = any> {
  origin?: HTMLElement;
  data?: D;
  component?: Type<T>,
  type?: OverlayType;
  classes?: string;
  closable?: boolean;
  closeOnNavigationChange?: boolean;
  withBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  x?: OverlayXPosition;
  y?: OverlayYPosition;
  fullWidth?: boolean;
  fullHeight?: boolean;
  backdropClickThrough?: boolean;
  backdropClass?: string;
  backdropOpacity?: Opacity;
  preferredConnectedPosition?: OverlayConnectedPosition;
  parentWide?: boolean;
  noScroll?: boolean;
}

abstract class OverlayConfigBuilder<T, D> {

  abstract _config: OverlayConfig<T>;

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

  get config(): OverlayConfig<T, D> {
    if (!this._config.component) {
      throw new Error('You need to provide a component to inject into the overlay');
    }
    return this._config;
  }
}

export class GlobalOverlayConfigBuilder<T, D = any> extends OverlayConfigBuilder<T, D>{

  _config: OverlayConfig<T, D> = {
    type: OverlayType.Modal,
    x: OverlayXPosition.Center,
    y: OverlayYPosition.Middle,
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

  type(type: OverlayType) {
    this._config.type = type;
    return this;
  }

  position(x: OverlayXPosition, y: OverlayYPosition) {
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

  static full<T, D>(component: Type<T>): GlobalOverlayConfigBuilder<T, D> {
    return new GlobalOverlayConfigBuilder<T, D>()
      .component(component)
      .type(OverlayType.Full)
      .fullHeight(true)
      .noScroll(true)
      .fullWidth(true)
      .fullWidth(true)
      .isClosable(true)
      .withBackdrop(true);
  }
}

export class ConnectedOverlayConfigBuilder<T, D> extends OverlayConfigBuilder<T, D> {

  _config: OverlayConfig<T> = {
    type: OverlayType.Connected,
    closable: true,
    closeOnNavigationChange: true,
    withBackdrop: true,
    closeOnBackdropClick: true,
    preferredConnectedPosition: OverlayConnectedPosition.BottomLeft,
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

  preferredConnectedPosition(position: OverlayConnectedPosition) {
    this._config.preferredConnectedPosition = position;
    return this;
  }
}
