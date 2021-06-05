import {TemplateRef} from '@angular/core';
import {BackdropColor} from '../../../core/dialog';
import {Opacity} from '../../../core/utils';

export enum ModalType {
  Floating,
  Left,
  Right
}

export interface ModalConfig {
  type: ModalType;
  templateRef: TemplateRef<any>;
  backdropColor?: BackdropColor,
  backdropOpacity?: Opacity
  closeOnBackdropClick?: boolean;
}
