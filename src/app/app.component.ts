import {Component, HostBinding, OnInit, TemplateRef} from '@angular/core';
import {Asset, AssetList, AppStore} from './store';
import {Subject} from 'rxjs';
import {FiatCurrencyService} from './core/fiat';
import {CryptoCurrencyService} from './core/crypto';
import {ToastConfigBuilder, ToastService} from './shared/components/toast';
import {ModalService} from './shared/components/modal/modal.service';
import {DropdownMenuService} from './shared/components/dropdown-menu/dropdown-menu.service';
import {DialogXPosition} from './core/dialog';
import {takeUntil} from 'rxjs/operators';
import {Color} from './core/utils';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

 //@HostBinding('class') classList = 'bg-gray-200 dark:bg-gray-900 text-black dark:text-white max-w-screen-sm min-h-screen container';
 @HostBinding('class') classList = 'text-black dark:text-white';

  public testOptions = ['Test1','Test2','Test3','Test4','Test5','Test6','Test7','Test8','Test9','Test10','Test11','Test12'];
  public moreTestOptions = [
    {
      id: 1,
      name: 'bitcoin',
      shortname: 'btc'
    },
    {
      id: 2,
      name: 'dogecoin',
      shortname: 'doge'
    },
    {
      id: 3,
      name: 'ether',
      shortname: 'eth'
    },
    {
      id: 4,
      name: 'cardano',
      shortname: 'ada'
    }
  ];

  public assets: Asset[] = [];
  public lists: AssetList[] = [];
  public totalAmount: number = 0;

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
    private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    console.log('app initiating');
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

  add() {
    this.store.add({id: 'nano', name: 'Nano', shortname: 'nano', quantity: 16, rate: 7.8, marketChange: 10, color: Color.gray});
  }

}
