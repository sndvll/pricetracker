import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AssetModel, Color, Colors, DialogRef, initialValueChangedValidator} from '../../core';
import {AlertService, AlertType, ModalComponent, ModalConfig, ModalType, ModalService} from '../../shared';
import {filter} from 'rxjs/operators';
import {CurrencyDetailsService} from '../../currency-details';
import {Subject} from 'rxjs';

@Component({
  selector: 'asset-body',
  templateUrl: './asset-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetBodyComponent implements OnInit, OnDestroy {

  private _onDestroy = new Subject();

  @Input() asset!: AssetModel;

  @Output() onSave = new EventEmitter<AssetModel>();
  @Output() onDelete = new EventEmitter<string>();

  private _modalRef!: DialogRef<ModalComponent, ModalConfig> | null;

  public editModalForm!: FormGroup;

  constructor(private modal: ModalService,
              private alert: AlertService,
              private formBuilder: FormBuilder,
              private details: CurrencyDetailsService
  ) {}

  public ngOnInit() {
    this.editModalForm = this.formBuilder.group({
      quantity: [this.asset.quantity, Validators.required],
      color: [this.asset.color, Validators.required]
    });
    this.editModalForm.setValidators(initialValueChangedValidator(this.editModalForm.value));
  }

  public ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public openEditModal(templateRef: TemplateRef<any>) {
    this._modalRef = this.modal.open({
      templateRef, type: ModalType.Floating, data: this.asset
    })
  }

  public delete() {
    this.close();
    this.alert.open<boolean>({
      type: AlertType.Warning,
      message: 'Do you really want to delete this asset?'
    })
      .onClose$
      .pipe(filter(v => v))
      .subscribe(() => this.onDelete.emit(this.asset.id));
  }

  public save() {
    const { color, quantity } = this.editModalForm.value;
    this.onSave.emit({...this.asset, color, quantity});
    this.close();
  }

  public close() {
    if (this._modalRef) {
      this._modalRef.close();
      this._modalRef = null;
    }
  }

  public openDetails() {
    const {id, name, symbol} = this.asset;
    this.details.open({id, name, symbol})
  }

  get colors() {
    return Colors.filter(color => color !== Color.transparent);
  }

  get rate(): number {
    return this.asset.price.current_price || 0;
  }
}
