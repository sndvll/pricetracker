import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  AlertService,
  AlertType,
  DropdownMenuService,
  ModalComponent,
  ModalConfig,
  ModalService,
  ModalType
} from '../../shared';
import {filter} from 'rxjs/operators';
import {
  AssetList,
  AssetModel,
  AvailableCryptoCurrency,
  Color,
  Colors,
  DialogRef,
  FiatCurrencyService,
  getTotalAmount,
  getTotalPriceChange, initialValueChangedValidator,
  Language,
  LanguageService
} from '../../core';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'asset-list',
  templateUrl: './asset-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetListComponent implements OnInit {

  private _contextMenuRef!: DialogRef | null;
  private _editModalRef!: DialogRef<ModalComponent, ModalConfig> | null;
  private _list!: AssetList;

  public options: AvailableCryptoCurrency[] = [];

  @Input() set list(list: AssetList) {
    this._list = list;
  }

  @Input() displayCurrency!: string;
  @Input() currentLanguage!: Language;
  @Input() numberOfLists!: number;

  @Output() deleteList = new EventEmitter<string>();
  @Output() editList = new EventEmitter<{ name: string, order: number, id: string }>();
  @Output() editAsset = new EventEmitter<{ asset: AssetModel }>();
  @Output() deleteAsset = new EventEmitter<{ assetId: string, listId: string }>();
  @Output() expand = new EventEmitter<{listId: string, expanded: boolean}>();

  public editModalForm!: FormGroup;

  constructor(private dropdown: DropdownMenuService,
              private alert: AlertService,
              private modal: ModalService,
              private formBuilder: FormBuilder,
              private fiat: FiatCurrencyService,
              private language: LanguageService) {
  }

  ngOnInit() {
    this.editModalForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      order: [this.list.order, Validators.required]
    });
    this.editModalForm.setValidators(initialValueChangedValidator(this.editModalForm.value));
  }

  public openContextMenu(event: Event,origin: HTMLElement, dropdown: TemplateRef<any>) {
    event.stopPropagation();
    this._contextMenuRef = this.dropdown.open(origin, dropdown);
  }

  public openDeleteListAlert(): void {
    this.closeContextMenu();
    this.alert.open<boolean>({
      type: AlertType.Warning,
      message: this.language.translate('ALERT.DELETE_LIST'),
    })
      .onClose$
      .pipe(filter(v => v))
      .subscribe(() => this.deleteList.emit(this.id));
  }

  public onSaveEditedAsset(asset: AssetModel) {
    this.editAsset.emit({asset});
  }

  public onDeleteAsset(assetId: string) {
    this.deleteAsset.emit({assetId, listId: this.id});
  }

  public closeContextMenu() {
    if (this._contextMenuRef) {
      this._contextMenuRef.close();
      this._contextMenuRef = null;
    }
  }

  public openEditModal(templateRef: TemplateRef<any>) {
    this.closeContextMenu();
    this._editModalRef = this.modal.open({
      templateRef,
      type: ModalType.Floating
    });
  }

  public onSaveEditedList() {
    const {name, order} = this.editModalForm.value;
    this.editList.emit({name, order, id: this.id});
    this.closeEditModal();
  }

  public closeEditModal() {
    if (this._editModalRef) {
      this._editModalRef.close();
      this._editModalRef = null;
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

  get totalListPriceChange(): number {
    return getTotalPriceChange(this.list.assets);
  }

  get negativeChange(): boolean{
    return this.totalListPriceChange < 0;
  }
  get assets(): AssetModel[] {
    return this.list.assets;
  }
  get id() {
    return this.list.id;
  }
  get name() {
    return this.list.name;
  }
  get list() {
    return this._list;
  }
  get expanded() {
    return this.list.expanded;
  }

  get orderOptions(): number[] {
    return Array.from(Array(this.numberOfLists).keys())
      .map(v => v + 1);
  }
}
