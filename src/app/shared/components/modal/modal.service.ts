import {Injectable, TemplateRef} from '@angular/core';
import {DialogService, DialogYPosition, GlobalDialogConfigBuilder} from '../../../core/dialog';
import {ModalComponent} from './modal.component';

@Injectable({providedIn: 'root'})
export class ModalService {

  constructor(private dialog: DialogService) {}

  open(templateRef: TemplateRef<any>) {

    const dialogConfig = GlobalDialogConfigBuilder.modal<ModalComponent>(templateRef, DialogYPosition.Top)
      .component(ModalComponent)
      .classes('mt-5')
      .config;

    return this.dialog.open(dialogConfig);
  }
}
