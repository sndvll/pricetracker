import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Inject, OnInit} from '@angular/core';
import {AssetList, AvailableCryptoCurrency, PriceTrackerStore} from '../core';
import {take} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Color, Colors, OVERLAY_REF, OverlayRef} from '@sndvll/core';

@Component({
  selector: 'add-asset',
  templateUrl: './add-asset.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAssetComponent implements OnInit {

  public asset: AvailableCryptoCurrency;
  public availableLists: Omit<AssetList, 'assets'>[] = [];
  public colors: Color[] = Colors;

  public addAssetForm!: FormGroup;

  public createList = false;

  @HostBinding('class') classList = 'bg-gray-100 dark:bg-black dark:text-white flex flex-col overflow-hidden pb-10';

  constructor(@Inject(OVERLAY_REF) private overlayRef: OverlayRef<AddAssetComponent, AvailableCryptoCurrency>,
              private store: PriceTrackerStore,
              private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef) {
    this.asset = overlayRef.config.data!;
  }

  ngOnInit() {
    this.addAssetForm  = this.formBuilder.group({
      'list': ['', [Validators.required]],
      'color': ['', [Validators.required]],
      'quantity': ['', [Validators.required]]
    });

    this.store.lists$
      .pipe(take(1))
      .subscribe(lists => {
        this.availableLists = lists
          .filter(list => !list.assets.some(asset => asset.id === this.asset.id))
          .map(list => ({
            id: list.id,
            name: list.name,
            type: list.type,
            expanded: list.expanded,
            order: list.order
          }));
        this.createList = !this.availableLists.length
        this.changeDetectorRef.markForCheck();
      });
  }

  save() {
    const { quantity, color, list } = this.addAssetForm.value;
    this.createList ?
      this.store.createNewList(list, {quantity, color, ...this.asset}) :
      this.store.addNewAsset(list.id, {quantity, color, ...this.asset});
    this.overlayRef.close();
  }

  close() {
    this.overlayRef.close();
  }

  get noAvailableLists(): boolean {
    return this.availableLists.length === 0;
  }

  toggleCreateList() {
    this.addAssetForm.reset('list');
    this.createList = !this.createList;
  }
}
