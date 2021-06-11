import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {Asset} from '../../store';
import {ModalService} from '../../shared/components/modal/modal.service';
import {ModalConfig, ModalType} from '../../shared/components/modal/modal.config';
import {ModalComponent} from '../../shared/components/modal/modal.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {initialValueChangedValidator, Colors, DialogRef} from '../../core';

@Component({
  selector: 'asset-body',
  templateUrl: './asset-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetBodyComponent implements OnInit {

  @Input() asset!: Asset;
  @Output() onSave = new EventEmitter<Omit<Asset, 'rate' | 'name' | 'shortname' | 'marketChange'>>();

  private _modalRef!: DialogRef<ModalComponent, ModalConfig> | null;

  public formGroup!: FormGroup;

  constructor(private modal: ModalService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      quantity: [this.asset.quantity, Validators.required],
      color: [this.asset.color, Validators.required]
    });
    this.formGroup.setValidators(initialValueChangedValidator(this.formGroup.value));
  }

  public openModal(templateRef: TemplateRef<any>) {
    this._modalRef = this.modal.open({
      templateRef, type: ModalType.Floating, data: this.asset
    })
  }

  save() {
    const { id } = this.asset;
    const { color, quantity } = this.formGroup.value;
    this.onSave.emit({id, color, quantity});
    this.close();
  }

  close() {
    if (this._modalRef) {
      this._modalRef.close();
      this._modalRef = null;
    }
  }

  get colors() {
    return Colors;
  }

}
