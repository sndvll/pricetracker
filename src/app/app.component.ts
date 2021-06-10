import {Component, HostBinding, TemplateRef} from '@angular/core';
import {Asset, AssetList, AppStore} from './store';
import {SelectOption} from './shared/components/select/select.component';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FiatCurrencyService} from './core/fiat';
import {CryptoCurrencyService} from './core/crypto';
import {ToastConfigBuilder, ToastService} from './shared/components/toast';
import {ModalService} from './shared/components/modal/modal.service';
import {DropdownMenuService} from './shared/components/dropdown-menu/dropdown-menu.service';
import {DialogService, DialogXPosition} from './core/dialog';
import {takeUntil} from 'rxjs/operators';
import {ModalType} from './shared/components/modal/modal.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

 //@HostBinding('class') classList = 'bg-gray-200 dark:bg-gray-900 text-black dark:text-white max-w-screen-sm min-h-screen container';
 @HostBinding('class') classList = 'text-black dark:text-white';


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
    private store: AppStore,
    private toast: ToastService,
    private modal: ModalService,
    private dropdown: DropdownMenuService,
    private dialog: DialogService,
    private formBuilder: FormBuilder) {

    console.log('app initiated')

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
