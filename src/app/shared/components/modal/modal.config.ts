import {TemplateRef} from '@angular/core';
import {Opacity} from '../../../core/utils';

export enum ModalType {
  Floating,
  Left,
  Right
}

export interface ModalConfig {
  type: ModalType;
  templateRef: TemplateRef<any>;
  backdropClass?: string,
  backdropOpacity?: Opacity
  closeOnBackdropClick?: boolean;
  width?: string;
  closable?: boolean
}
