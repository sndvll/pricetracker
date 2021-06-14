import {ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {AppStore, Asset} from '../../store';
import {DropdownMenuService} from '../../shared';
import {DialogRef} from '../../core';
import {AlertService, AlertType} from '../../shared';
import {debounceTime, filter, take} from 'rxjs/operators';
import {ModalService, ModalComponent, ModalConfig, ModalType} from '../../shared';
import {AccordionComponent} from '../../shared';
import {AvailableCryptoCurrency, CryptoCurrencyService} from '../../core';
import {FormBuilder, Validators} from '@angular/forms';
import {Color, Colors} from '../../core';



@Component({
  selector: 'asset-list',
  templateUrl: './asset-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetListComponent {

  private _contextMenuRef!: DialogRef;
  private _addAssetModalRef!: DialogRef<ModalComponent, ModalConfig> | null;

  public options: AvailableCryptoCurrency[] = [];
  public addAssetForm = this.formBuilder.group({
    asset: ['', [Validators.required]],
    quantity: ['', [Validators.required]],
    color: [Color.black, [Validators.required]]
  });

  @Input() id!: string;
  @Input() assets!: Asset[];
  @Input() name!: string;

  @ViewChild(AccordionComponent) accordion!: AccordionComponent;

  constructor(private dropdown: DropdownMenuService,
              private alert: AlertService,
              private modal: ModalService,
              private store: AppStore,
              private crypto: CryptoCurrencyService,
              private formBuilder: FormBuilder) {}

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
      .subscribe(() => this.store.deleteList(this.id));
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
    this.closeContextMenu();
  }

  public onSelectAssetSearch(searchPhrase: string) {
    if (searchPhrase) {
      this.crypto.search(searchPhrase.trim(), 'name', 100)
        .pipe(
          take(1),
          debounceTime(50)
        )
        .subscribe(currencies => {
          if (currencies.length) {
            this.options = currencies;
          } else {
            this.options = [];
          }
        });
    } else {
      this.options = [];
    }
  }

  public onSelectAssetClose() {
    this.options = [];
  }

  public addNewAsset() {
    const {asset, quantity, color} = this.addAssetForm.value;
    this.store.addNewAsset({...asset, quantity, color}, this.id)
    this.closeAddAssetModal();
  }

  public saveEditedAsset(asset: Partial<Asset>){
    this.store.saveEditedAsset(asset, this.id);
  }

  public deleteAsset(assetId: string) {
    this.store.deleteAsset(assetId, this.id);
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

  get colors() {
    return Colors.filter(color => color !== Color.transparent);
  }

}
