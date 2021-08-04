import {ChangeDetectionStrategy, Component, Input, Output, TemplateRef, ViewChild, EventEmitter} from '@angular/core';
import {AlertService, AlertType, DropdownMenuService, ModalService, AccordionComponent} from '../../shared';
import {debounceTime, filter, take} from 'rxjs/operators';
import {AvailableCryptoCurrency, CryptoCurrencyService, DialogRef, Color, Colors, AssetModel} from '../../core';

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

  @Output() deleteList = new EventEmitter<string>();
  @Output() editList = new EventEmitter<{ name: string, id: string }>();
  @Output() editAsset = new EventEmitter<{ asset: AssetModel }>();
  @Output() deleteAsset = new EventEmitter<{ assetId: string, listId: string }>();

  @ViewChild(AccordionComponent) accordion!: AccordionComponent;

  constructor(private dropdown: DropdownMenuService,
              private alert: AlertService,
              private modal: ModalService,
              private crypto: CryptoCurrencyService) {}

  public openContextMenu(origin: HTMLElement, dropdown: TemplateRef<any>) {
    this._contextMenuRef = this.dropdown.open(origin, dropdown);
  }

  public openDeleteListAlert(): void {
    this.onCloseContextMenu();
    this.alert.open<boolean>({
      type: AlertType.Warning,
      message: 'ASSET_LIST.ALERT.DELETE_LIST'
    })
      .onClose$
      .pipe(filter(v => v))
      .subscribe(() => this.deleteList.emit(this.id));
  }

  public openChangeNameAlert() {
    this.onCloseContextMenu();
    this.alert.open<string>({
      type: AlertType.Input,
      message: 'ASSET_LIST.ALERT.CHANGE_NAME',
      editValueName: 'ASSET_LIST.ALERT.EDIT_VALUE_NAME',
      data: this.name
    })
      .onClose$
      .pipe(filter(v => v))
      .subscribe(name => this.editList.emit({name, id: this.id}));
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

  public onSaveEditedAsset(asset: AssetModel){
    this.editAsset.emit({asset});
  }

  public onDeleteAsset(assetId: string) {
    this.deleteAsset.emit({assetId, listId: this.id});
  }

  public onCloseContextMenu() {
    if (this._contextMenuRef) {
      this._contextMenuRef.close();
    }
  }

  get colors() {
    return Colors.filter(color => color !== Color.transparent);
  }

}
