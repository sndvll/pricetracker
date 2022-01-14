import {Component, EventEmitter, Output, TemplateRef, ViewChild} from '@angular/core';
import {
  AvailableCryptoCurrency,
  CryptoCurrencyService,
} from '../../core';
import {SearchbarComponent, SearchbarResultComponent, SearchbarResultConfig} from '@sndvll/components';
import {ConnectedOverlayConfigBuilder, OverlayConnectedPosition, OverlayRef, OverlayService} from '@sndvll/core';

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

  private overlayRef!: OverlayRef;

  constructor(private dialog: OverlayService,
              private crypto: CryptoCurrencyService) {}

  public open() {
    const { nativeElement } = this.searchbar.elementRef;
    const dialogConfig = new ConnectedOverlayConfigBuilder<SearchbarResultComponent, SearchbarResultConfig>()
      .preferredConnectedPosition(OverlayConnectedPosition.BottomLeft)
      .origin(nativeElement)
      .component(SearchbarResultComponent)
      .backdropClass('bg-transparent')
      .data({
        templateRef: this.searchResultRef,
        width: `${nativeElement.clientWidth}px`
      })
      .config;
    this.isOpen = true;
    this.overlayRef = this.dialog.open(dialogConfig);
    this.overlayRef.onClose$
      .subscribe(() => {
        this.isOpen = false;
      })
  }

  public onSearch(searchPhrase: string) {
    if (!this.isOpen) {
      this.open();
    }
    if (searchPhrase) {
      this.crypto.search(searchPhrase, 75)
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
    if (this.overlayRef) {
      this.overlayRef.close();
    }
  }

}
