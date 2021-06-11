import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ContentChildren,
  ElementRef,
  forwardRef,
  HostBinding,
  Input, OnDestroy, QueryList, TemplateRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {
  ConnectedDialogConfigBuilder,
  DialogConnectedPosition,
  DialogService
} from '../../../core/dialog';
import {Observable, race, Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {SelectOptionComponent} from './select-option.component';
import {SelectDropdownComponent} from './select-dropdown.component';

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
      <div class="rounded bg-white dark:bg-black">
        <ng-container *ngFor="let option of options">
          <ng-container [ngTemplateOutlet]="option.optionContent"></ng-container>
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

  private _valueChanges: Subject<any> = new Subject<any>();
  public valueChanges$ = this._valueChanges.asObservable();

  public opened = false;

  @ContentChildren(SelectOptionComponent) options!: QueryList<SelectOptionComponent>;

  @HostBinding('class') classList = 'select-component';

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

  ngAfterContentInit() {
    this.selectedOption = this.options.find(option => option.value === this._selectedValue)!;
  }

  open(optionsTemplate: TemplateRef<any>) {
    this.opened = true;
    const config = new ConnectedDialogConfigBuilder<SelectDropdownComponent, TemplateRef<any>>()
      .data(optionsTemplate)
      .origin(this.elementRef.nativeElement)
      .component(SelectDropdownComponent)
      .parentWide(true)
      .preferredConnectedPosition(DialogConnectedPosition.BottomLeft)
      .config;

    const dialogRef = this.dialog.open(config);

    const onSelect: Observable<any>[] = this.options.map(item => item.onSelect$);
    race(onSelect)
      .pipe(take(1))
      .subscribe((option: SelectOptionComponent) => {
        this.selectedOption = option;
        dialogRef.close();
      });

    dialogRef.onClose$
      .subscribe(() => {
        this.opened = false;
        this.changeDetectorRef.markForCheck();
      });

  }

  clear(event: Event) {
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

  registerOnChange(fn: any): void {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  writeValue(selected: any): void {
    if (selected) {
      this.selected = selected;
    }
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
