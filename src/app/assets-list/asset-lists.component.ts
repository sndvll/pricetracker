import {Component, OnDestroy, OnInit} from '@angular/core';
import {AssetList, AssetModel, FiatCurrencyService, PriceTrackerStore} from '../core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {LanguageService} from '@sndvll/core';

@Component({
  selector: 'asset-lists',
  templateUrl: './asset-lists.component.html'
})
export class AssetListsComponent implements OnInit, OnDestroy {

  private _lists: AssetList[] = [];

  private _onDestroy = new Subject<void>();

  set lists(lists: AssetList[]) {
    this._lists = [...lists];
  }
  get lists() {
    return this._lists;
  }

  public displayCurrency = FiatCurrencyService.DisplayCurrency;
  public currentLanguage = LanguageService.currentLang;

  constructor(private store: PriceTrackerStore,
              private language: LanguageService) {}

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

  public editList({name, id}: { name: string; id: string}) {
    this.store.editList(name, id);
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

  reorderLists(event: CdkDragDrop<AssetList[]>) {
    if (this.lists.length > 1) {
      moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
      this.store.reorder(this.lists);
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
