import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Input, Output,
  ViewChild,
  EventEmitter, HostListener
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export const INPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true
}

@Component({
  selector: 'sndvll-input',
  templateUrl: './input.component.html',
  providers: [INPUT_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor {

  @HostBinding('class') classList = 'input-component';

  private _disabled: boolean = false;
  private _showClearButton = false;
  private _value = new BehaviorSubject< string | number>('');
  public value$ = this._value.asObservable();

  @Output() public onValueChanges = new EventEmitter<any>();

  @Input() placeholder: string = '';
  @Input() type: 'text' | 'password' | 'number' = 'text';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Input() set value(value: string | number) {

    if (value) {
      // Hey Typescript. If i want to check if a value is NaN or not,
      // please don't say that the variable "is not a number" when trying to input it
      // into isNaN.. ffs.
      // @ts-ignore
      value = isNaN(value) ? value : Number(value);
    } else {
      value = '';
    }

    this._value.next(value);
    this.onValueChanges.emit(value);
    this.showClearButton = true;
    this._controlValueAccessorChangeFn(value);

    if (!value) {
      this.showClearButton = false;
    }

    this.changeDetectorRef.markForCheck();
  }
  get value() {
    return this._value.getValue();
  }

  set showClearButton(value: boolean) {
    this._showClearButton = value;
    this.changeDetectorRef.markForCheck();
  }
  get showClearButton(): boolean {
    return this._showClearButton;
  }

  @Input() set disabled(value: boolean) {
    this._disabled = value != null && `${value} ` !== 'false';
  }
  get disabled(): boolean {
    return this._disabled;
  }

  @ViewChild('input') input!: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public clear() {
    this.value = '';
    this._controlValueAccessorChangeFn('');
    this.input.nativeElement.value = '';
  }

  public change(value:  string | number) {
    this.value = value;
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
    this._disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  writeValue(value: string | number): void {
    if (value) {
      this.value = value;
    }
  }
}
