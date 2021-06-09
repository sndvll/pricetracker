import {Component, HostBinding, Input, TemplateRef, ViewChild} from "@angular/core";
import {Color} from '../../core/utils';
import {ExpansionComponent} from '../../shared/components/expansion/expansion.component';
import {ModalService} from '../../shared/components/modal/modal.service';
import {ModalType} from '../../shared/components/modal/modal.config';
import {Asset} from '../store';
import {ExpansionService} from '../../shared/components/expansion/expansion.service';

@Component({
  selector: 'asset',
  template: `
    <sndvll-expansion class="block w-full rounded px-2 py-1 my-1"
                      [class.bg-gray-100]="expansion.expanded"
                      [class.dark:bg-gray-800]="expansion.expanded" #expansion>
      <sndvll-expansion-header class="grid grid-cols-7 grid-flow-col auto-cols-min" (click)="toggle()">
        <div class="flex items-center justify-center">
          <asset-icon [shortName]="asset.shortName" class="text-gray-600 dark:text-gray-100 bg-{{asset.color}}-300 dark:bg-{{asset.color}}-400"></asset-icon>
        </div>
        <div class="flex flex-col justify-center ml-2">
          <span class="text-lg font-bold">{{asset.shortName | uppercase}}</span>
          <span class="truncate text-xs">{{asset.name}}</span>
        </div>
        <div class="pl-2 break-all text-right flex flex-col col-span-3 justify-center">
          <span class="text-sm">{{asset.rate | currency}}</span>
          <span class="text-xs font-bold"
                [class.text-red-500]="negativeChange"
                [class.text-green-500]="!negativeChange">
            {{asset.marketChange | change}}
          </span>
        </div>
        <div class="pl-2 break-all text-right flex flex-col col-span-2">
          <span class="text-sm">{{asset.quantity | number : '1.2-6'}}</span>
        </div>
      </sndvll-expansion-header>
      <sndvll-expansion-body>
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
      </sndvll-expansion-body>
    </sndvll-expansion>

    <ng-template #editModal>
      Lets edit!
    </ng-template>
  `,
})
export class AssetComponent {

  @ViewChild('expansion') expansion!: ExpansionComponent;

  @HostBinding('class') classList = 'rounded select-none';

  @Input() asset!: Asset;

  constructor(private modal: ModalService,
              private expansionService: ExpansionService) {}

  toggle() {
    this.expansionService.toggle(this.expansion);
  }

  get negativeChange(): boolean {
    return this.asset.marketChange < 0;
  }

  public openModal(templateRef: TemplateRef<any>) {
    this.modal.open({templateRef, type: ModalType.Floating, data: this.asset})
  }


}
