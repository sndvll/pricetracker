import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {
  Color,
  Colors,
  OverlayRef,
  initialValueChangedValidator,
  LanguageService
} from '@sndvll/core';
import {AlertService, AlertType, ButtonModule, InputModule, ModalComponent, ModalConfig, ModalModule, ModalService, ModalType, SelectModule} from '@sndvll/components';
import {filter, map} from 'rxjs/operators';
import {CurrencyDetailsService} from '../../currency-details';
import {Observable} from 'rxjs';
import {AssetModel, FiatCurrencyService} from '../../core';
import {AmountPipe} from '../../shared';
import {IconsModule} from '../../shared';
import {TranslateModule} from '@ngx-translate/core';

@Component({
    selector: 'asset-body',
    templateUrl: './asset-body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, AmountPipe, InputModule, SelectModule, IconsModule, ButtonModule, ModalModule]
})
export class AssetBodyComponent implements OnInit {

  @Input() asset!: AssetModel;

  @Output() onSave = new EventEmitter<AssetModel>();
  @Output() onDelete = new EventEmitter<string>();

  @Input() displayCurrency!: string;
  @Input() currentLanguage!: string;

  private _modalRef!: OverlayRef<ModalComponent, ModalConfig> | null;

  public editModalForm!: UntypedFormGroup;

  constructor(private modal: ModalService,
              private alert: AlertService,
              private formBuilder: UntypedFormBuilder,
              private details: CurrencyDetailsService,
              private language: LanguageService,
              private fiat: FiatCurrencyService
  ) {}

  public ngOnInit() {
    this.editModalForm = this.formBuilder.group({
      quantity: [this.asset.quantity, Validators.required],
      color: [this.asset.color, Validators.required]
    });
    this.editModalForm.setValidators(initialValueChangedValidator(this.editModalForm.value));
  }

  public openEditModal(templateRef: TemplateRef<any>) {
    this._modalRef = this.modal.open({
      templateRef,
      type: ModalType.Floating
    })
  }

  public delete() {
    this.close();
    this.alert.open<boolean>({
      type: AlertType.Warning,
      message: this.language.translate('ALERT.DELETE_ASSET'),
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

  get amount(): Observable<number> {
    return this.fiat.getConvertedRateBySelectedCurrency(this.asset.price.current_price!, this.displayCurrency)
      .pipe(
        map(convertedAmount => this.asset.quantity * convertedAmount)
      )
  }
}
