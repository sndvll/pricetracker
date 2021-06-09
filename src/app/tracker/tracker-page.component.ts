import {Component, OnDestroy, OnInit, TemplateRef} from "@angular/core";
import {
  CryptoCurrencyService,
  DialogService,
  DialogXPosition,
  FiatCurrencyService
} from "../core";
import {Asset, AssetList, AssetStore} from './store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ToastConfigBuilder, ToastService} from '../shared/components/toast';
import {SelectOption} from '../shared/components/select/select.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalService} from '../shared/components/modal/modal.service';
import {ModalType} from '../shared/components/modal/modal.config';
import {DropdownMenuService} from '../shared/components/dropdown-menu/dropdown-menu.service';

@Component({
  selector: 'tracker',
  templateUrl: './tracker-page.component.html',
  styleUrls: ['./tracker-page.component.scss']
})
export class TrackerPageComponent implements OnInit, OnDestroy {

  public assets: Asset[] = [];
  public lists: AssetList[] = [];
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
    private dropdown: DropdownMenuService,
    private dialog: DialogService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.store.selectLists
      .pipe(takeUntil(this._onDestroy))
      .subscribe(lists => this.lists = lists);
    this.store.selectTotalAmount
      .pipe(takeUntil(this._onDestroy))
      .subscribe(amount => this.totalAmount = amount);
    //this.openToast();
    //this.formGroup.valueChanges.subscribe(console.log);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  openDropdown(origin: HTMLElement, templateRef: TemplateRef<any>) {
    this.dropdown.open(origin, templateRef)
  }

  openToast() {
    this.toast.open(ToastConfigBuilder.success({
      time: 10,
      message: 'Detta är ett meddelande',
      x: DialogXPosition.Right
    }));
  }

  openModal(templateRef: TemplateRef<any>) {
    this.modal.open({type: ModalType.Floating, templateRef});
  }

  add() {
    this.store.add({id: 'nano', name: 'Nano', shortName: 'nano', quantity: 16, rate: 7.8, marketChange: 10, color: 'gray'});
  }

}
