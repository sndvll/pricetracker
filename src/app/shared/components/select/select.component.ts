import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ContentChildren,
  ElementRef, EventEmitter,
  forwardRef,
  HostBinding,
  Input, OnDestroy, Output, QueryList, TemplateRef, ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {
  ConnectedDialogConfigBuilder,
  DialogConnectedPosition, DialogRef,
  DialogService
} from '../../../core/dialog';
import {Observable, race, Subject} from 'rxjs';
import {take, takeUntil, tap} from 'rxjs/operators';
import {SelectOptionComponent} from './select-option.component';
import {SelectDropdownComponent} from './select-dropdown.component';
import {InputComponent} from '../input/input.component';

export const SELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true
}

let nextUniqueId = 0;

@Component({
  selector: 'sndvll-select',
  template: `
    <div class="select-label" [class]="size" (click)="open(dropdown)">
      <ng-container *ngIf="selectedOption" [ngTemplateOutlet]="selectedOption.label.template"></ng-container>
      <ng-container *ngIf="!selectedOption">
        <span class="select-placeholder">{{placeholder}}</span>
      </ng-container>
      <ng-container *ngIf="clearable && selectedOption && !opened">
        <button (click)="clear($event)" class="select-clear-button">
          <icon name="x" weight="bold"></icon>
        </button>
      </ng-container>
    </div>
    <div class="select-chevron-container" [class]="size">
      <button class="select-chevron focus:outline-none focus:cursor-pointer" [class]="size" (click)="open(dropdown)">
        <icon [name]="opened ? 'chevron-up' : 'chevron-down'" [size]="'sm'" weight="bold"></icon>
      </button>
    </div>
    <ng-template #dropdown>
      <div class="rounded bg-white dark:bg-gray-900">
        <ng-container *ngIf="searchable">
          <div class="text-white p-2">
            <sndvll-input placeholder="Search" size="sm" (onValueChanges)="search($event)"></sndvll-input>
          </div>
        </ng-container>
        <ng-container *ngIf="options?.length">
          <ng-container *ngFor="let option of options">
            <ng-container [ngTemplateOutlet]="option.optionContent"></ng-container>
          </ng-container>
        </ng-container>
        <ng-container *ngIf="!options?.length">
          <div class="text-black dark:text-white text-center w-full px-2 py-5 text-lg">
            <ng-container *ngIf="searchStatus === 'pristine'">
              Please search for something
            </ng-container>
            <ng-container *ngIf="searchStatus === 'noresult'">
              No results
            </ng-container>
          </div>
        </ng-container>
      </div>
    </ng-template>
  `,
  providers: [SELECT_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {

  private _onDestroy = new Subject<void>();
  private _uniqueId = `sndvll-select-${nextUniqueId++}`;
  private _disabled: boolean = false;
  private _selectedValue: any;
  private _selectedOption!: SelectOptionComponent | null;

  public searchStatus: 'pristine' | 'result' | 'noresult' = 'pristine';

  @Output() onSearch = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();

  private _valueChanges: Subject<any> = new Subject<any>();
  public valueChanges$ = this._valueChanges.asObservable();

  public opened = false;

  @ContentChildren(SelectOptionComponent) options!: QueryList<SelectOptionComponent>;
  @ViewChild(InputComponent) searchField!: InputComponent;

  @HostBinding('class') classList = 'select-component';

  @Input() searchable: boolean = false;
  @Input() placeholder: String = '';
  @Input() clearable = true;

  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() id: string = this._uniqueId;
  @Input() set disabled(value: boolean) {
    this._disabled = value != null && `${value} ` !== 'false';
  }
  get disabled(): boolean {
    return this._disabled;
  }
  @Input() set selected(value: any) {
    if (value) {
      this._selectedValue = value;
      this._controlValueAccessorChangeFn(value);
      this._valueChanges.next(value);
    }
  }

  get value() {
    return this._selectedValue;
  }

  set selectedOption(option: SelectOptionComponent | null) {
    if (option) {
      this._selectedOption = option;
      this.selected = option.value;
    }
    this.changeDetectorRef.markForCheck();
  }
  get selectedOption(): SelectOptionComponent | null {
    return this._selectedOption;
  }

  constructor(private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private dialog: DialogService) {
  }

  public ngAfterContentInit() {
    this.selectedOption = this.options
      .find(option => option.value === this._selectedValue)!;
  }

  public open(optionsTemplate: TemplateRef<any>) {

    this.opened = true;

    const config = new ConnectedDialogConfigBuilder<SelectDropdownComponent, TemplateRef<any>>()
      .data(optionsTemplate)
      .origin(this.elementRef.nativeElement)
      .component(SelectDropdownComponent)
      .parentWide(true)
      .preferredConnectedPosition(DialogConnectedPosition.BottomLeft)
      .config;

    const dialogRef = this.dialog.open(config);


    if (!this.searchable) {
      // This is the simple one. Just map out observables from the options
      // and race them to the first emitted selection.
      // When done set the selected option, and close the dialog.
      const onSelect: Observable<any>[] = this.options.map(item => item.onSelect$);
      race(onSelect)
        .pipe(take(1))
        .subscribe((option: SelectOptionComponent) => {
          this.selectedOption = option;
          dialogRef.close();
        });
    } else {
      this._handleSearchable(dialogRef);
    }

    dialogRef.onClose$
      .subscribe(() => {
        this.opened = false;
        this.changeDetectorRef.markForCheck();
        this.onClose.emit();
        this.searchStatus = 'pristine';
      });
  }

  private _handleSearchable(dialogRef: DialogRef) {
    // Yeah wow think i need to document this out for my own sake.
    // This happens when a select is searchable (duh..!) but it's
    // doing some specific stuff because the options change when searching.

    // This firs subject is just a destroyer, that unsubscribing the race observables
    // a bit down. So on every change of the options (ie when searching and new results comes in)
    // we're just killing those subscriptions. From what i (quickly) gathered online race is just unsubscribing
    // when a value is emitted from one of the observables, and we don't want those stacking up when we have
    // large result set. (If anyone else is planning on using this, please use caution and maybe limit the amount
    // of options to 30-40 at most.
    let onChangeDestroyer: Subject<void>;

    // Subscribing to changes of the options, ie result set changes (to more or less) and handle stuff when that happens.
    // Unsubscribing when closing the dropdown.
    this.options.changes
      .pipe(takeUntil(this.onClose))
      .subscribe((options: QueryList<SelectOptionComponent>) => {
        if (onChangeDestroyer) {
          // If we have a previous destroyer, next it to unsubscribe to previous race.
          onChangeDestroyer.next();
          onChangeDestroyer.complete();
        }
        // And always create a new one for the new set.
        onChangeDestroyer = new Subject<void>();

        // No options? Set status accordingly to show a message depending on the search inputs value.
        if (!options.length) {
          this.searchStatus = this.searchField.value ? 'noresult' : 'pristine';
        } else {
          // Status says we have result, actually not that useful but just good to indicate that something is found..
          this.searchStatus = 'result';

          // Map out onSelect observables from the options.
          const onSelect: Observable<any>[] = options
            .map(item => item.onSelect$);

          // Race these observables. Unsubscribe when destroyer nexted and completed.
          // When done, set selectedOption, kill the destroyer, just for the sake of it.
          // This is probably not really needed, but one never know so to be safe and kill it.
          // Close the dialog.
          race(onSelect)
            .pipe(takeUntil(onChangeDestroyer))
            .subscribe((option: SelectOptionComponent) => {
              this.selectedOption = option;
              onChangeDestroyer.next();
              onChangeDestroyer.complete();
              dialogRef.close();
            });
        }
        // Tell angular to check for changes!
        this.changeDetectorRef.markForCheck();
      });
  }

  public search(searchPhrase: string){
    this.onSearch.emit(searchPhrase);
  }

  public clear(event: Event) {
    if (this.clearable) {
      event.stopPropagation();
      this._selectedOption = null;
      this._selectedValue = null;
      this._controlValueAccessorChangeFn(null);
      this._valueChanges.next();
    }
  }

  private _onTouched: () => any = () => {};
  private _controlValueAccessorChangeFn: (value: any) => void = () => {};

  public registerOnChange(fn: any): void {
    this._controlValueAccessorChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  public writeValue(selected: any): void {
    if (selected) {
      this.selected = selected;
    }
    this.changeDetectorRef.markForCheck();
  }

  public ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
