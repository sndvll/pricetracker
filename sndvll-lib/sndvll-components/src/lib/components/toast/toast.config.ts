import {OverlayXPosition, OverlayYPosition} from '@sndvll/core';

export enum ToastType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error'
}

export interface ToastConfig {
  x: OverlayXPosition;
  y: OverlayYPosition;
  time: number;
  type: ToastType
  message?: string;
}

type ToastConfigBuilderPreset = Partial<Omit<ToastConfig, 'type'>>;

export class ToastConfigBuilder {

  private _x = OverlayXPosition.Center;
  private _y = OverlayYPosition.Top;
  private _time = 10;
  private _type = ToastType.Info;
  private _message = '';

  position(x: OverlayXPosition, y: OverlayYPosition) {
    this._x = x;
    this._y = y;
    return this;
  }
  time(time: number = 10) {
    this._time = time;
    return this;
  }
  type(type: ToastType) {
    this._type = type;
    return this;
  }

  message(message: string) {
    this._message = message;
    return this;
  }

  build(): ToastConfig {
    return {
      x: this._x,
      y: this._y,
      message: this._message,
      time: this._time,
      type: this._type
    }
  }

  static success({x, y, time, message}: ToastConfigBuilderPreset): ToastConfig {
    return new ToastConfigBuilder()
      .message(message!)
      .position(x ?? OverlayXPosition.Center, y ?? OverlayYPosition.Top)
      .type(ToastType.Success)
      .time(time)
      .build()
  }

  static error({x, y, time, message}: ToastConfigBuilderPreset): ToastConfig {
    return new ToastConfigBuilder()
      .message(message!)
      .position(x ?? OverlayXPosition.Center, y ?? OverlayYPosition.Top)
      .type(ToastType.Error)
      .time(time)
      .build()
  }

  static info({x, y, time, message}: ToastConfigBuilderPreset): ToastConfig {
    return new ToastConfigBuilder()
      .message(message!)
      .position(x ?? OverlayXPosition.Center, y ?? OverlayYPosition.Top)
      .type(ToastType.Info)
      .time(time)
      .build()
  }

  static warning({x, y, time, message}: ToastConfigBuilderPreset): ToastConfig {
    return new ToastConfigBuilder()
      .message(message!)
      .position(x ?? OverlayXPosition.Center, y ?? OverlayYPosition.Top)
      .type(ToastType.Warning)
      .time(time)
      .build()
  }
}
