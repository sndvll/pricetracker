import {Component, HostBinding, Inject, TemplateRef} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';

@Component({
  template: `
    <ng-container *ngTemplateOutlet="templateRef"></ng-container>
  `,
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  public templateRef: TemplateRef<any>

  @HostBinding('class') classList = 'px-6 py-12 bg-white border-0 shadow-lg rounded-xl';
  @HostBinding('style.width') width = '500px';

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef<TemplateRef<any>>) {
    console.log(dialogRef);
    this.templateRef = dialogRef.config.data!;
  }
}
