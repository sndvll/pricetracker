import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  HostListener, Input,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {ColorHue, Color, ColorUtils} from '@sndvll/core';

export const TOGGLE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleComponent),
  multi: true
}

@Component({
  selector: 'sndvll-toggle',
  templateUrl: './toggle.component.html',
  providers: [TOGGLE_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent implements ControlValueAccessor {

  private _disabled: boolean = false;
  private _checked = new BehaviorSubject<boolean>(false);
  public checked$ = this._checked.asObservable();

  @HostBinding('class') classList = 'mb-3';

  @Input() color: Color = Color.blue;
  @Input() hue: ColorHue = '400';
  get checkedColor(): string {
    return `${ColorUtils.color(this.color, this.hue)} ${ColorUtils.color(this.color, this.hue, true)}`;
  }

  @Input() set disabled(value: boolean) {
    this._disabled = value != null && `${value} ` !== 'false';
  }
  get disabled(): boolean {
    return this._disabled;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  @HostListener('click', ['$event'])click(event: MouseEvent) {
    event.preventDefault();
    this._check(!this._checked.getValue())
  }


  private _check(value: boolean) {
    if (!this.disabled) {
      this._checked.next(value);
      this._controlValueAccessorChangeFn(value);
      this.changeDetectorRef.markForCheck();
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
  }

  public writeValue(value: boolean): void {
    this._check(value);
  }
}
