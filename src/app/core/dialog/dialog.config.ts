import {InjectionToken} from '@angular/core';

export enum DialogType {
  Full = 'full',
  Dialog = 'dialog',
}

export enum DialogXPosition {
  Center = 'center',
  Left = 'left',
  Right = 'right'
}

export enum DialogYPosition {
  Center = 'center',
  Top = 'top',
  Bottom = 'bottom',
}

export interface DialogConfig<D = any> {
  data?: D,
  type?: DialogType;
  xPosition?: DialogXPosition;
  yPosition?: DialogYPosition;
  closeOnNavChange?: boolean,
  closable?: boolean;
  classes?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
  closeOnClick?: boolean;
  backdropColor?: string;
}

export const DIALOG_REF = new InjectionToken<any>('DIALOG_REF');
export const DIALOG_DATA = new InjectionToken<any>('DIALOG_DATA');
