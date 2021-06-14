import {Component, EventEmitter, Output, TemplateRef, ViewChild} from '@angular/core';
import {ConnectedDialogConfigBuilder, DialogConnectedPosition, DialogRef, DialogService} from '../../core/dialog';
import {SearchbarComponent} from '../../shared/components/searchbar';
import {AvailableCryptoCurrency, CryptoCurrencyService} from '../../core/crypto';
import {
  SearchbarResultComponent,
  SearchbarResultConfig
} from '../../shared/components/searchbar';

@Component({
  selector: 'crypto-searchbar',
  template: `
    <sndvll-searchbar class="mb-2"
                      size="sm"
                      (valueChanges)="onSearch($event)"></sndvll-searchbar>

    <ng-template #searchResultRef>
      <ng-container *ngIf="searchStatus === 'result'">
        <searchbar-result-item *ngFor="let currency of searchResult"
             class="flex flex-row justify-between items-center py-1 px-2">
          <div class="w-full h-8 hover:bg-gray-100 cursor-pointer rounded px-2 flex items-center"
               (click)="onOpenCurrencyDetails(currency)">
            {{currency.name}}
          </div>
          <button sndvll-btn="icon">
            <icon name="plus-circle" (click)="add(currency)"></icon>
          </button>
        </searchbar-result-item>
      </ng-container>
      <ng-container *ngIf="searchStatus === 'empty'">
        <div class="w-full text-center">
          Search for any coin.
        </div>
      </ng-container>
      <ng-container *ngIf="searchStatus === 'noresult'">
        <div class="w-full text-center">
          No results, try something else.
        </div>
      </ng-container>
    </ng-template>
  `
})
export class CryptoSearchbarComponent {

  @ViewChild(SearchbarComponent) searchbar!: SearchbarComponent;
  @ViewChild('searchResultRef') searchResultRef!: TemplateRef<any>;

  @Output() openCurrencyDetails = new EventEmitter<AvailableCryptoCurrency>();
  @Output() addCurrency = new EventEmitter<AvailableCryptoCurrency>();

  public searchResult: AvailableCryptoCurrency[] = [];
  public searchStatus: 'result' | 'noresult' | 'empty' = 'empty';
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
      this.searchStatus = 'empty';
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

  private _close() {
    if (this._dialogRef) {
      this._dialogRef.close();
    }
  }

}
