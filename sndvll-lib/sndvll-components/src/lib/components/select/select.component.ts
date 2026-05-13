import {
  AfterContentChecked,
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
  ConnectedOverlayConfigBuilder,
  OverlayConnectedPosition,
  OverlayService
} from '@sndvll/core';
import {Observable, race, Subject} from 'rxjs';
import {SelectOptionComponent} from './select-option.component';
import {SelectDropdownComponent} from './select-dropdown.component';
import {InputComponent} from '../input';

export const SELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true
}

let nextUniqueId = 0;

@Component({
  selector: 'sndvll-select',
  templateUrl: './select.component.html',
  providers: [SELECT_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent<T = any> implements ControlValueAccessor, AfterContentChecked, OnDestroy {

  private _onDestroy = new Subject<void>();
  private _uniqueId = `sndvll-select-${nextUniqueId++}`;
  private _disabled: boolean = false;
  private _selectedValue: any;
  private _selectedOption!: SelectOptionComponent<T> | null;

  @Output() onClose = new EventEmitter<void>();

  private _valueChanges: Subject<any> = new Subject<any>();
  public valueChanges$ = this._valueChanges.asObservable();

  public opened = false;

  @ContentChildren(SelectOptionComponent) options!: QueryList<SelectOptionComponent<T>>;
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
    this.changeDetectorRef.markForCheck();
  }

  get value() {
    return this._selectedValue;
  }

  set selectedOption(option: SelectOptionComponent<T> | null) {
    if (option) {
      this._selectedOption = option;
      this.selected = option.value;
    }
    this.changeDetectorRef.markForCheck();
  }
  get selectedOption(): SelectOptionComponent<T> | null {
    return this._selectedOption;
  }

  constructor(private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private overlay: OverlayService) {
  }

  ngAfterContentChecked() {
    const selectedOption = this.options.find(option => option.value === this._selectedValue);
    if (!this.selectedOption && selectedOption) {
      this.selectedOption = selectedOption;
    }
  }

  public open(optionsTemplate: TemplateRef<any>) {

    this.opened = true;

    const config = new ConnectedOverlayConfigBuilder<SelectDropdownComponent, TemplateRef<any>>()
      .data(optionsTemplate)
      .origin(this.elementRef.nativeElement)
      .component(SelectDropdownComponent)
      .parentWide(true)
      .preferredConnectedPosition(OverlayConnectedPosition.BottomLeft)
      .config;

    const overlayRef = this.overlay.open(config);
    const onSelect: Observable<SelectOptionComponent<T>>[] = this.options.map(item => item.onSelect$);

    race(onSelect)
      .subscribe((option: SelectOptionComponent<T>) => {
        this.selectedOption = option;
        overlayRef.close();
      });

    overlayRef.onClose$
      .subscribe(() => {
        this.opened = false;
        this.changeDetectorRef.markForCheck();
        this.onClose.emit();
      });
  }


  public clear(event: Event) {
    if (this.clearable) {
      event.stopPropagation();
      this._selectedOption = null;
      this._selectedValue = null;
      this._controlValueAccessorChangeFn(null);
      this._valueChanges.next(null);
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
  }

  public ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
