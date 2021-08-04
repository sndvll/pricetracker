import {Component, EventEmitter, Output, TemplateRef, ViewChild} from '@angular/core';
import {
  AvailableCryptoCurrency,
  ConnectedDialogConfigBuilder,
  CryptoCurrencyService,
  DialogConnectedPosition,
  DialogRef,
  DialogService
} from '../../core';
import {SearchbarComponent, SearchbarResultComponent, SearchbarResultConfig} from '../../shared';

@Component({
  selector: 'crypto-searchbar',
  templateUrl: './crypto-searchbar.component.html'
})
export class CryptoSearchbarComponent {

  @ViewChild(SearchbarComponent) searchbar!: SearchbarComponent;
  @ViewChild('searchResultRef') searchResultRef!: TemplateRef<any>;

  @Output() openCurrencyDetails = new EventEmitter<AvailableCryptoCurrency>();
  @Output() addCurrency = new EventEmitter<AvailableCryptoCurrency>();

  public searchResult: AvailableCryptoCurrency[] = [];
  public searchStatus: 'result' | 'noresult' | null = null;
  public isOpen: boolean = false;

  private _dialogRef!: DialogRef;

  constructor(private dialog: DialogService,
              private crypto: CryptoCurrencyService) {}

  public open() {
    const { nativeElement } = this.searchbar.elementRef;
    const dialogConfig = new ConnectedDialogConfigBuilder<SearchbarResultComponent, SearchbarResultConfig>()
      .preferredConnectedPosition(DialogConnectedPosition.BottomLeft)
      .origin(nativeElement)
      .component(SearchbarResultComponent)
      .backdropClass('bg-transparent')
      .data({
        templateRef: this.searchResultRef,
        width: `${nativeElement.clientWidth}px`
      })
      .config;
    this.isOpen = true;
    this._dialogRef = this.dialog.open(dialogConfig);
    this._dialogRef.onClose$
      .subscribe(() => {
        this.isOpen = false;
      })
  }

  public onSearch(searchPhrase: string) {
    if (!this.isOpen) {
      this.open();
    }
    if (searchPhrase) {
      this.crypto.search(searchPhrase, 'name', 200)
        .subscribe(searchResult => {
          this.searchStatus = searchResult.length ? 'result' : 'noresult';
          this.searchResult = searchResult;
        });
    } else {
      this.searchResult = [];
      this.searchStatus = null;
      this._close();
    }
  }

  public onOpenCurrencyDetails(currency: AvailableCryptoCurrency) {
    this.openCurrencyDetails.emit(currency);
    this.searchbar.clear();
    this._close();
  }

  public add(currency: AvailableCryptoCurrency) {
    this.addCurrency.emit(currency);
    this.searchbar.clear();
    this._close();
  }

  get count() {
    return this.crypto.count;
  }

  public reloadCurrencyDatabase() {
    this.crypto.loadAvailableCurrencies();
    this._close();
  }

  private _close() {
    if (this._dialogRef) {
      this._dialogRef.close();
    }
  }

}
