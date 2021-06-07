import {Component, Directive, HostBinding, Inject, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
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
            sndvll-btn="icon"
            class="absolute rounded-full -right-2 -top-2 text-white bg-black dark:bg-gray-600 text-white"
            (click)="close()">
      <icon name="x" weight="bolder"></icon>
    </button>
    <ng-container *ngTemplateOutlet="templateRef"></ng-container>
  `,
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {

  public templateRef: TemplateRef<any>

  private readonly _modalConfig: ModalConfig;

  @HostBinding('class') classList = 'modal';
  @HostBinding('style.width') width = '400px';
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
