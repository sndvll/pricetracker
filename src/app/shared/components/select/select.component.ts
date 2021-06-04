import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';
import {ConnectedDialogConfigBuilder, DialogConnectedPosition, DialogService} from '../../../core/dialog';
import {BehaviorSubject} from 'rxjs';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SelectDropdownComponent} from './select-dropdown.component';

export interface SelectOption<T = any> {
  label: string;
  value: T;
  selected?: boolean;
}

let nextUniqueId = 0;

export const SELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true
}

@Component({
  selector: 'sndvll-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SELECT_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements ControlValueAccessor {

  private _options: SelectOption[] = [];
  private _selected = new BehaviorSubject<Partial<SelectOption> | undefined>({});
  private _uniqueId = `sndvll-select-${nextUniqueId++}`;
  private _disabled: boolean = false;
  public selectedChanges = this._selected.asObservable();

  public opened = false;
  @Input() placeholder: string = '';

  @Input() id: string = this._uniqueId;
  @Input() set options(options: SelectOption[]) {
    if (options) {
      this._options = options;
      this._setSelected();
    }
  }

  @Input() set selected(selected: SelectOption) {
    if (selected && this._options) {
      this.options = this._options.map(option => option === selected ?
        {...option, selected: true} : {...option, selected: false});
      this._setSelected();
    }
  }

  @Input() set disabled(value: boolean) {
    this._disabled = value != null && `${value} ` !== 'false';
  }
  get disabled(): boolean {
    return this._disabled;
  }

  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @HostBinding('class') classList = 'select-component';

  constructor(private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private dialog: DialogService) {
  }

  private _onTouched: () => any = () => {};
  private _controlValueAccessorChangeFn: (value: any) => void = () => {};

  public open() {
    this.opened = true;

    const config = new ConnectedDialogConfigBuilder()
      .data(this._options)
      .origin(this.elementRef.nativeElement)
      .component(SelectDropdownComponent)
      .parentWide(true)
      .preferredConnectedPosition(DialogConnectedPosition.BottomLeft)
      .config;

    const dialogRef = this.dialog.open(config);
    dialogRef.onClose$
      .subscribe((options) => {
        if (options) {
          this.options = options;
        }
        this.opened = false;
        this.changeDetectorRef.markForCheck();
      });
  }

  private _setSelected() {
    if (this._options.some(option => option.selected)) {
      const selectedIndex = this._options.findIndex(option => option.selected);
      const selected = this._options[selectedIndex];
      this._selected.next(selected);
      const {label, value} = selected;
      this._controlValueAccessorChangeFn({label, value});
    }
    this.changeDetectorRef.markForCheck();
  }

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
}




