import {ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {AppStore, AssetModel} from '../../store';
import {DropdownMenuService} from '../../shared';
import {DialogRef} from '../../core';
import {AlertService, AlertType} from '../../shared';
import {debounceTime, filter, take} from 'rxjs/operators';
import {ModalService} from '../../shared';
import {AccordionComponent} from '../../shared';
import {AvailableCryptoCurrency, CryptoCurrencyService} from '../../core';
import {Color, Colors} from '../../core';

@Component({
  selector: 'asset-list',
  templateUrl: './asset-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetListComponent {

  private _contextMenuRef!: DialogRef;

  public options: AvailableCryptoCurrency[] = [];

  @Input() id!: string;
  @Input() assets!: AssetModel[];
  @Input() name!: string;

  @ViewChild(AccordionComponent) accordion!: AccordionComponent;

  constructor(private dropdown: DropdownMenuService,
              private alert: AlertService,
              private modal: ModalService,
              private store: AppStore,
              private crypto: CryptoCurrencyService) {}

  public openContextMenu(origin: HTMLElement, dropdown: TemplateRef<any>) {
    this._contextMenuRef = this.dropdown.open(origin, dropdown);
  }

  public openDeleteListAlert(): void {
    this.closeContextMenu();
    this.alert.open<boolean>({
      type: AlertType.Warning,
      message: 'ASSET_LIST.ALERT.DELETE_LIST'
    })
      .onClose$
      .pipe(filter(v => v))
      .subscribe(() => this.store.deleteList(this.id));
  }

  public openChangeNameAlert() {
    this.closeContextMenu();
    this.alert.open<string>({
      type: AlertType.Input,
      message: 'ASSET_LIST.ALERT.CHANGE_NAME',
      editValueName: 'ASSET_LIST.ALERT.EDIT_VALUE_NAME',
      data: this.name
    })
      .onClose$
      .pipe(filter(v => v))
      .subscribe(name => this.store.editList(name, this.id));
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

  public saveEditedAsset(asset: Partial<AssetModel>){
    this.store.saveEditedAsset(asset, this.id);
  }

  public deleteAsset(assetId: string) {
    this.store.deleteAsset(assetId, this.id);
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
