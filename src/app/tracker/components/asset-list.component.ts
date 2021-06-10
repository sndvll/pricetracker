import {Component, Input, TemplateRef} from '@angular/core';
import {Asset} from '../store';
import {DropdownMenuService} from '../../shared/components/dropdown-menu/dropdown-menu.service';
import {DialogRef} from '../../core/dialog';

@Component({
  selector: 'asset-list',
  template: `
    <card class="bg-white dark:bg-black px-2 py-1 shadow mb-2">
      <div class="justify-between" cardHeader>
        <span class="font-bold text-sm">{{name}}</span>
        <button sndvll-btn="icon" #dropdownOrigin (click)="openMenu(dropdownOrigin, dropdown)">
          <icon name="more-vertical"></icon>
        </button>
      </div>
      <div cardContent>
        <div class="grid grid-cols-7 grid-flow-col auto-cols-min px-2 text-xs font-bold">
          <div class="text-right col-span-5">Rate</div>
          <div class="text-right col-span-2">Quantity</div>
        </div>

        <sndvll-accordion>
            <sndvll-accordion-item
                class="block rounded select-none my-1 px-2 py-1"
                *ngFor="let asset of assets"
                [class.bg-gray-100]="item.expanded"
                [class.dark:bg-gray-800]="item.expanded"
                #item>
              <sndvll-accordion-item-header>
                <asset-header [asset]="asset"></asset-header>
              </sndvll-accordion-item-header>
              <sndvll-accordion-item-content>
                <asset-body [asset]="asset"></asset-body>
              </sndvll-accordion-item-content>
            </sndvll-accordion-item>
        </sndvll-accordion>
      </div>
    </card>

    <ng-template #dropdown>
      <a sndvll-dropdown-item (click)="close()" class="text-black dark:text-white">
        <icon name="plus-circle"></icon>
        <span class="ml-1">Add asset</span>
      </a>
      <a sndvll-dropdown-item (click)="close()" class="text-black dark:text-white">
        <icon name="edit"></icon>
        <span class="ml-1">Change name</span>
      </a>
      <a sndvll-dropdown-item (click)="close()" class="text-red-400 dark:text-red-400">
        <icon name="trash-2"></icon>
        <span class="ml-1">Delete List</span>
      </a>
    </ng-template>
  `
})
export class AssetListComponent {

  private _dropdownRef!: DialogRef;

  @Input() assets!: Asset[];
  @Input() name!: string;

  constructor(private dropdown: DropdownMenuService) {}

  openMenu(origin: HTMLElement, dropdown: TemplateRef<any>) {
    this._dropdownRef = this.dropdown.open(origin, dropdown);
  }

  close() {
    if (this._dropdownRef) {
      this._dropdownRef.close();
    }
  }

}
