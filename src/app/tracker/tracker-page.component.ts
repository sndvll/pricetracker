import {Component, OnDestroy, OnInit, TemplateRef} from "@angular/core";
import {
  ConnectedDialogConfigBuilder,
  CryptoCurrencyService,
  DialogConnectedPosition,
  DialogService,
  FiatCurrencyService
} from "../core";
import {Asset, AssetStore} from './store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ToastConfigBuilder, ToastService} from '../shared/components/toast';
import {TestComponent} from './components/test.component';
import {SelectOption} from '../shared/components/select/select.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalService} from '../shared/components/modal/modal.service';

@Component({
  selector: 'tracker',
  templateUrl: './tracker-page.component.html',
  styleUrls: ['./tracker-page.component.scss']
})
export class TrackerPageComponent implements OnInit, OnDestroy {

  public assets: Asset[] = [];
  public totalAmount: number = 0;

  public options: SelectOption<string>[] = [
    {label: 'Hej', value: 'heeej'},
    {label: 'Ett värde', value: 'värdet'},
    {label: 'Ett till värde', value: 'ännu ett värde'}
  ];

  private _onDestroy = new Subject<void>();

  public formGroup: FormGroup = this.formBuilder.group({
    select: [''],
    input: [''],
    toggle: [{value: false, disabled: false}]
  });

  constructor(
    private fiat: FiatCurrencyService,
    private crypto: CryptoCurrencyService,
    private store: AssetStore,
    private toast: ToastService,
    private modal: ModalService,
    private dialog: DialogService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.store.selectAssets
      .pipe(takeUntil(this._onDestroy))
      .subscribe(assets => this.assets = assets);
    this.store.selectTotalAmount
      .pipe(takeUntil(this._onDestroy))
      .subscribe(amount => this.totalAmount = amount);
    //this.openToast();
    this.formGroup.valueChanges.subscribe(console.log);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openConnected(origin: HTMLElement, position: DialogConnectedPosition) {
    const dialogRef = this.dialog.open<TestComponent>(new ConnectedDialogConfigBuilder<TestComponent>()
      .data(['GOT SOME DATA MF'])
      .component(TestComponent)
      .preferredConnectedPosition(position)
      .origin(origin)
      .config);
    dialogRef.checkPosition();
  }

  openConnectedRight(origin: HTMLElement) {
    this.openConnected(origin, DialogConnectedPosition.Right)
  }

  openConnectedMiddleBottom(origin: HTMLElement) {
    this.openConnected(origin, DialogConnectedPosition.BottomMiddle)
  }

  openConnectedTopRight(origin: HTMLElement) {
    this.openConnected(origin, DialogConnectedPosition.TopRight)
  }

  openConnectedLeft(origin: HTMLElement) {
    this.openConnected(origin, DialogConnectedPosition.Left)
  }

  openToast() {
    this.toast.open(ToastConfigBuilder.success({time: 10, message: 'Detta är ett meddelande'}));
  }

  openModal(templateRef: TemplateRef<any>) {
    this.modal.open(templateRef);
  }

  add() {
    this.store.add({name: 'Nano', shortName: 'nano', quantity: 16, rate: 7.8, change: 10});
  }

}
