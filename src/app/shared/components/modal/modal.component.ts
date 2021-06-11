import {Component, Directive, HostBinding, Inject, OnInit, TemplateRef} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';
import {ModalConfig, ModalType} from './modal.config';

@Directive({
  selector: 'div[modalContent]'
})
export class ModalContentDirective {
  @HostBinding('class') classList = 'modal-content';
}

@Directive({
  selector: 'div[modalHeader]'
})
export class ModalHeaderDirective {
  @HostBinding('class') classList = 'modal-header';
}

@Directive({
  selector: 'div[modalFooter]'
})
export class ModalFooterDirective {
  @HostBinding('class') classList = 'modal-footer';
}

@Component({
  template: `<ng-container *ngTemplateOutlet="templateRef"></ng-container>`,
})
export class ModalComponent implements OnInit {

  public templateRef: TemplateRef<any>

  private readonly _modalConfig: ModalConfig;

  @HostBinding('class') classList = 'modal-component';
  @HostBinding('class.full-height') fullHeight = false;
  @HostBinding('class.floating') floating = false;

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef<ModalComponent, ModalConfig>) {
    this._modalConfig = dialogRef.config.data!;
    this.templateRef = this._modalConfig.templateRef;
  }

  ngOnInit() {
    const {type} = this._modalConfig;
    this.floating = type === ModalType.Floating;
    this.fullHeight = this.dialogRef.config.fullHeight ?? false;
  }


  get showCloseButton(): boolean {
    const {closable} = this.dialogRef.config;
    const {type} = this._modalConfig;
    return type === ModalType.Floating && closable!;
  }

  close() {
    if (this.dialogRef.config.closable) {
      this.dialogRef.close();
    }
  }
}
