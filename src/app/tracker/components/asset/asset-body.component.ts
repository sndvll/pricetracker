import {Component, Input, TemplateRef} from '@angular/core';
import {Asset} from '../../store';
import {ModalService} from '../../../shared/components/modal/modal.service';
import {ModalType} from '../../../shared/components/modal/modal.config';

@Component({
  selector: 'asset-body',
  template: `
    <div class="grid grid-cols-7 grid-flow-col auto-cols-min text-xs font-bold">
      <div class="text-right col-span-5">Amount</div>
      <div class="text-right col-span-2 pr-1"></div>
    </div>
    <div class="grid grid-cols-7 grid-flow-col auto-cols-min">
      <div class="col-span-5 text-right text-lg font-bold">
        {{asset.quantity * asset.rate | currency}}
      </div>
      <div class="col-span-2 text-right">
        <button sndvll-btn="icon" (click)="openModal(editModal)">
          <icon name="edit"></icon>
        </button>
      </div>
    </div>

    <ng-template #editModal>
      Lets edit!
    </ng-template>
  `
})
export class AssetBodyComponent {

  @Input() asset!: Asset;

  constructor(private modal: ModalService) {}

  public openModal(templateRef: TemplateRef<any>) {
    this.modal.open({templateRef, type: ModalType.Floating, data: this.asset})
  }
}
