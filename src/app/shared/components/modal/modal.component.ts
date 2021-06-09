import {Component, Directive, HostBinding, Inject, OnInit, TemplateRef} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';
import {ModalConfig, ModalType} from './modal.config';

@Directive({
  selector: '[modalContent]'
})
export class ModalContentDirective {
  @HostBinding('class.modal-content') header = true;
}

@Directive({
  selector: '[modalHeader]'
})
export class ModalHeaderDirective {
  @HostBinding('class.modal-header') header = true;
}


@Component({
  template: `
    <button *ngIf="showCloseButton"
            class="modal-close-button"
            (click)="close()">
      <icon name="x" weight="bolder"></icon>
    </button>
    <ng-container *ngTemplateOutlet="templateRef"></ng-container>
  `,
})
export class ModalComponent implements OnInit {

  public templateRef: TemplateRef<any>

  private readonly _modalConfig: ModalConfig;

  @HostBinding('class') classList = 'modal';
  @HostBinding('style.width') width = '';
  @HostBinding('class.full-height') fullHeight = false;
  @HostBinding('class.floating') floating = false;

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef<ModalComponent, ModalConfig>) {
    this._modalConfig = dialogRef.config.data!;
    this.templateRef = this._modalConfig.templateRef;
  }

  ngOnInit() {
    const {type, width} = this._modalConfig;
    this.floating = type === ModalType.Floating;
    this.fullHeight = this.dialogRef.config.fullHeight ?? false;
    this.width = width ?? this.width;
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
