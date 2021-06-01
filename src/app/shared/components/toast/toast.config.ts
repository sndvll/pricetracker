import {DialogXPosition} from '../../../core/dialog';

export enum ToastType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error'
}

export interface ToastConfig {
  position: DialogXPosition;
  time: number;
  type: ToastType
  message?: string;
}

type ToastConfigBuilderPreset = Partial<Omit<ToastConfig, 'message' | 'type'>>;

export class ToastConfigBuilder {

  private _position = DialogXPosition.Center;
  private _time = 10;
  private _type = ToastType.Info;
  private _message = '';

  position(position: DialogXPosition = DialogXPosition.Center) {
    this._position = position;
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
      position: this._position,
      message: this._message,
      time: this._time,
      type: this._type
    }
  }

  static success({position, time}: ToastConfigBuilderPreset = {}): ToastConfig {
    return new ToastConfigBuilder()
      .position(position)
      .type(ToastType.Success)
      .time(time)
      .build()
  }

  static error({position, time}: ToastConfigBuilderPreset = {}): ToastConfig {
    return new ToastConfigBuilder()
      .position(position)
      .type(ToastType.Error)
      .time(time)
      .build()
  }

  static info({position, time}: ToastConfigBuilderPreset = {}): ToastConfig {
    return new ToastConfigBuilder()
      .position(position)
      .type(ToastType.Info)
      .time(time)
      .build()
  }

  static warning({position, time}: ToastConfigBuilderPreset = {}): ToastConfig {
    return new ToastConfigBuilder()
      .position(position)
      .type(ToastType.Warning)
      .time(time)
      .build()
  }
}
