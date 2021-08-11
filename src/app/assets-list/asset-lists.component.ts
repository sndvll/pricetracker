import {Component, OnDestroy, OnInit} from '@angular/core';
import {AssetList, AssetModel, FiatCurrencyService, LanguageService, PriceTrackerStore} from '../core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'asset-lists',
  template: `
    <asset-list *ngFor="let list of lists"
                class="md:mx-2 mb-2 w-full md:w-50"
                [list]="list"
                [displayCurrency]="displayCurrency"
                [currentLanguage]="currentLanguage"
                (deleteAsset)="deleteAsset($event)"
                (deleteList)="deleteList($event)"
                (editAsset)="editAsset($event)"
                (editList)="editList($event)"
                (expand)="expand($event)"
    ></asset-list>`
})
export class AssetListsComponent implements OnInit, OnDestroy {

  private _onDestroy = new Subject<void>();

  public lists: AssetList[] = [];
  public displayCurrency = FiatCurrencyService.DisplayCurrency;
  public currentLanguage = LanguageService.currentLang;

  constructor(private store: PriceTrackerStore,
              private language: LanguageService) {
  }

  ngOnInit() {
    this.store.state$
      .pipe(
        takeUntil(this._onDestroy)
      )
      .subscribe(({lists, displayCurrency}) => {
        this.displayCurrency = displayCurrency;
        this.lists = lists;
      });
    this.language.currentLanguage$
      .pipe(takeUntil(this._onDestroy))
      .subscribe(currentLanguage => this.currentLanguage = currentLanguage)
  }

  public editAsset({asset}: { asset: AssetModel }) {
    this.store.editAsset(asset);
  }

  public editList({name, id, order}: { name: string; id: string, order: number}) {
    this.store.editList(name, id, order);
  }

  public deleteAsset({assetId, listId}: { assetId: string; listId: string }) {
    this.store.deleteAsset(assetId, listId);
  }

  public deleteList(id: string) {
    this.store.deleteList(id);
  }

  public expand({expanded, listId}: {expanded: boolean, listId: string}) {
    this.store.expandList(listId, expanded);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
