import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Asset} from '../../store';
import {ModalService} from '../../shared';
import {ModalConfig, ModalType} from '../../shared';
import {ModalComponent} from '../../shared';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Color, Colors, DialogRef, initialValueChangedValidator} from '../../core';
import {AlertService, AlertType} from '../../shared';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'asset-body',
  templateUrl: './asset-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetBodyComponent implements OnInit {

  @Input() asset!: Asset;
  @Output() onSave = new EventEmitter<Omit<Asset, 'rate' | 'name' | 'symbol' | 'marketChange'>>();
  @Output() onDelete = new EventEmitter<string>();

  private _modalRef!: DialogRef<ModalComponent, ModalConfig> | null;

  public editModalForm!: FormGroup;

  constructor(private modal: ModalService,
              private alert: AlertService,
              private formBuilder: FormBuilder) {
  }

  public ngOnInit() {
    this.editModalForm = this.formBuilder.group({
      quantity: [this.asset.quantity, Validators.required],
      color: [this.asset.color, Validators.required]
    });
    this.editModalForm.setValidators(initialValueChangedValidator(this.editModalForm.value));
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

  get colors() {
    return Colors.filter(color => color !== Color.transparent);
  }

}
