import {Component, HostBinding, Inject, TemplateRef} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';
import {ModalConfig, ModalType} from './modal.config';

@Component({
  template: '<ng-container *ngTemplateOutlet="templateRef"></ng-container>',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  public templateRef: TemplateRef<any>

  @HostBinding('class') classList = 'px-6 py-12 bg-white border-0 shadow-lg rounded-xl';
  @HostBinding('class.rounded-xl') rounded = false;
  @HostBinding('style.width') width = '500px';
  @HostBinding('class.h-full') fullHeight = false;

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef<ModalConfig>) {
    console.log(dialogRef);
    const {templateRef, type} = <ModalConfig>dialogRef.config.data;
    this.templateRef = templateRef;
    this.rounded = type === ModalType.Floating;
    this.fullHeight = dialogRef.config.fullHeight ?? false;
  }
}
