import {TemplateRef} from '@angular/core';
import {Opacity} from "@sndvll/core";

export enum ModalType {
  Floating,
  Left,
  Right
}

export interface ModalConfig<T = any> {
  type: ModalType;
  templateRef: TemplateRef<any>;
  backdropClass?: string,
  backdropOpacity?: Opacity
  closeOnBackdropClick?: boolean;
  closable?: boolean
  data?: T,
}
