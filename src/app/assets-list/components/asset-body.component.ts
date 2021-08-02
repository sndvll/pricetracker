import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {ModalService} from '../../shared';
import {ModalConfig, ModalType} from '../../shared';
import {ModalComponent} from '../../shared';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Color, Colors, DialogRef, initialValueChangedValidator} from '../../core';
import {AlertService, AlertType} from '../../shared';
import {filter, takeUntil} from 'rxjs/operators';
import {CurrencyDetailsService} from '../../currency-details/currency-details.service';
import {AppStore, AssetModel} from '../../store';
import {EventBusService, EventType} from '../../core/event/event-bus.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'asset-body',
  templateUrl: './asset-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetBodyComponent implements OnInit, OnDestroy {

  private _onDestroy = new Subject();

  @Input() asset!: AssetModel;
  @Output() onSave = new EventEmitter<Omit<AssetModel, 'name' | 'symbol'>>();
  @Output() onDelete = new EventEmitter<string>();

  public rate!: number;

  private _modalRef!: DialogRef<ModalComponent, ModalConfig> | null;

  public editModalForm!: FormGroup;

  constructor(private modal: ModalService,
              private alert: AlertService,
              private formBuilder: FormBuilder,
              private details: CurrencyDetailsService,
              private event: EventBusService,
              private changeDetectorRef: ChangeDetectorRef,
              private store: AppStore) {
  }

  public ngOnInit() {
    this.editModalForm = this.formBuilder.group({
      quantity: [this.asset.quantity, Validators.required],
      color: [this.asset.color, Validators.required]
    });
    this.editModalForm.setValidators(initialValueChangedValidator(this.editModalForm.value));

    this.event.on([EventType.PRICE])
      .pipe(
        takeUntil(this._onDestroy)
      )
      .subscribe(() => {
        this.rate = this.store.getCurrentRate(this.asset.id);
        this.changeDetectorRef.markForCheck();
      });
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
    const { id } = this.asset;
    const { color, quantity } = this.editModalForm.value;
    this.onSave.emit({id, color, quantity});
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
}
