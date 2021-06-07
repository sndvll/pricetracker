import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  ViewChild
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
  styleUrls: ['./input.component.scss'],
  providers: [INPUT_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor {

  private _disabled: boolean = false;
  private _showClearButton = false;
  private _value = new BehaviorSubject<string>('');

  public value$ = this._value.asObservable();

  @Input() placeholder: string = '';
  @Input() type: 'text' | 'password' = 'text';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Input() set value(value: string) {
    if (value) {
      this._value.next(value);
      this.showClearButton = true;
      this._controlValueAccessorChangeFn(value);
    } else {
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

  @HostBinding('class') classList = 'my-2 bg-white dark:bg-black text-black dark:text-white p-1 flex border border-gray-200 rounded';

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public clear() {
    this.value = '';
    this._controlValueAccessorChangeFn('');
    this.input.nativeElement.value = '';
  }

  public change(value: string) {
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

  writeValue(value: string): void {
    if (value) {
      this.value = value;
    }
  }
}
