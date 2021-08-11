import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild,} from '@angular/core';
import {AccordionComponent, AlertService, AlertType, DropdownMenuService} from '../../shared';
import {debounceTime, filter, take} from 'rxjs/operators';
import {
  AssetModel,
  AvailableCryptoCurrency,
  Color,
  Colors,
  CryptoCurrencyService,
  DialogRef,
  FiatCurrencyService,
  getTotalAmount,
  getTotalPriceChange,
  Language,
  LanguageService
} from '../../core';
import {Observable} from 'rxjs';

@Component({
  selector: 'asset-list',
  templateUrl: './asset-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetListComponent {

  private _contextMenuRef!: DialogRef;
  private _assets!: AssetModel[];

  public options: AvailableCryptoCurrency[] = [];

  public totalListPriceChange!: number;

  @Input() id!: string;
  @Input() name!: string;
  @Input() order!: number;
  @Input() displayCurrency!: string;
  @Input() currentLanguage!: Language;
  @Input() expanded!: boolean;

  @Input() set assets(assets: AssetModel[]) {
    this.totalListPriceChange = getTotalPriceChange(assets);
    this._assets = assets;
  }
  get assets(): AssetModel[] {
    return this._assets;
  }

  @Output() deleteList = new EventEmitter<string>();
  @Output() editList = new EventEmitter<{ name: string, order: number, id: string }>();
  @Output() editAsset = new EventEmitter<{ asset: AssetModel }>();
  @Output() deleteAsset = new EventEmitter<{ assetId: string, listId: string }>();
  @Output() expand = new EventEmitter<{listId: string, expanded: boolean}>();

  @ViewChild(AccordionComponent) accordion!: AccordionComponent;

  constructor(private dropdown: DropdownMenuService,
              private alert: AlertService,
              private crypto: CryptoCurrencyService,
              private fiat: FiatCurrencyService,
              private language: LanguageService) {
  }

  public openContextMenu(event: Event,origin: HTMLElement, dropdown: TemplateRef<any>) {
    event.stopPropagation();
    this._contextMenuRef = this.dropdown.open(origin, dropdown);
  }

  public openDeleteListAlert(): void {
    this.onCloseContextMenu();
    this.alert.open<boolean>({
      type: AlertType.Warning,
      message: this.language.translate('ALERT.DELETE_LIST'),
      labels: {
        ok: this.language.translate('ALERT.BUTTON.OK'),
        close: this.language.translate('ALERT.BUTTON.CLOSE'),
        save: this.language.translate('ALERT.BUTTON.SAVE'),
        warning: this.language.translate('ALERT.WARNING_MESSAGE'),
      }
    })
      .onClose$
      .pipe(filter(v => v))
      .subscribe(() => this.deleteList.emit(this.id));
  }

  public openChangeNameAlert() {
    this.onCloseContextMenu();
    this.alert.open<string>({
      type: AlertType.Input,
      message: this.language.translate('ALERT.CHANGE_NAME'),
      data: this.name,
      labels: {
        inputLabel: this.language.translate('ALERT.EDIT_VALUE_LABEL'),
        placeholder: this.language.translate('ALERT.EDIT_VALUE_LABEL'),
        ok: this.language.translate('ALERT.BUTTON.OK'),
        close: this.language.translate('ALERT.BUTTON.CLOSE'),
        save: this.language.translate('ALERT.BUTTON.SAVE'),
      }
    })
      .onClose$
      .pipe(filter(v => v))
      .subscribe(name => this.editList.emit({
        name,
        order: this.order,
        id: this.id
      }));
  }

  public openChangeOrderAlert() {
    this.onCloseContextMenu();
    this.alert.open<number>({
      type: AlertType.Input,
      message: 'Set order',
      data: this.order || 0,
      labels: {
        inputLabel: 'heej',
        placeholder: 'hej',
        ok: this.language.translate('ALERT.BUTTON.OK'),
        close: this.language.translate('ALERT.BUTTON.CLOSE'),
        save: this.language.translate('ALERT.BUTTON.SAVE'),
      }
    })
      .onClose$
      .subscribe(order => this.editList.emit({
        name: this.name,
        order,
        id: this.id
      }));
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

  public onSaveEditedAsset(asset: AssetModel) {
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

  public onExpand(expanded: boolean) {
    this.expand.emit({expanded, listId: this.id});
  }

  get colors() {
    return Colors.filter(color => color !== Color.transparent);
  }

  get totalListAmount(): Observable<number> {
    return this.fiat.getConvertedRateBySelectedCurrency(getTotalAmount(this.assets), this.displayCurrency);
  }

  get negativeChange(): boolean{
    return this.totalListPriceChange < 0;
  }
}
