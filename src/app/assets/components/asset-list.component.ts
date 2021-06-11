import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {AppStore, Asset} from '../../store';
import {DropdownMenuService} from '../../shared/components/dropdown-menu/dropdown-menu.service';
import {DialogRef} from '../../core/dialog';
import {AlertService, AlertType} from '../../shared/components/alert/alert.service';
import {filter} from 'rxjs/operators';
import {ModalService} from '../../shared/components/modal/modal.service';
import {ModalComponent} from '../../shared/components/modal/modal.component';
import {ModalConfig, ModalType} from '../../shared/components/modal/modal.config';


@Component({
  selector: 'asset-list',
  templateUrl: './asset-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetListComponent {

  private _contextMenuRef!: DialogRef;
  private _addAssetModalRef!: DialogRef<ModalComponent, ModalConfig> | null;

  @Input() id!: string;
  @Input() assets!: Asset[];
  @Input() name!: string;

  constructor(private dropdown: DropdownMenuService,
              private alert: AlertService,
              private modal: ModalService,
              private store: AppStore) {}

  public openContextMenu(origin: HTMLElement, dropdown: TemplateRef<any>) {
    this._contextMenuRef = this.dropdown.open(origin, dropdown);
  }

  public openDeleteListAlert(): void {
    this.closeContextMenu();
    this.alert.open<boolean>({
      type: AlertType.Warning,
      message: 'Do you really want to delete this list?'
    })
      .onClose$
      .pipe(filter(v => v))
      .subscribe(() => this.store.removeList(this.id));
  }

  public openChangeNameAlert() {
    this.closeContextMenu();
    this.alert.open<string>({
      type: AlertType.Input,
      message: 'Enter a new name',
      data: this.name
    })
      .onClose$
      .pipe(filter(v => v))
      .subscribe(name => this.store.editList(name, this.id));
  }

  public openAddAssetModal(templateRef: TemplateRef<any>) {
    this._addAssetModalRef = this.modal.open({
      templateRef, type: ModalType.Floating
    });
    this._addAssetModalRef.onClose$
      .subscribe((v) => {
        console.log(v);
      })
    this.closeContextMenu();
  }

  public saveNewAsset() {

  }

  public editAsset(asset: Partial<Asset>){
    this.store.editAsset(asset, this.id);
  }

  public closeAddAssetModal() {
    if (this._addAssetModalRef) {
      this._addAssetModalRef.close();
    }
  }

  public closeContextMenu() {
    if (this._contextMenuRef) {
      this._contextMenuRef.close();
    }
  }

}
