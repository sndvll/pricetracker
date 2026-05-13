import {Component, ElementRef, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'sndvll-searchbar',
  templateUrl: './searchbar.component.html'
})
export class SearchbarComponent {

  public inputFormControl = new FormControl('');

  @Output() valueChanges = this.inputFormControl.valueChanges;
  @Output() focus = new EventEmitter<void>();

  @Input() placeholder = '';
  @Input() size = 'md';

  constructor(public elementRef: ElementRef) {}

  @Input() set value(value: string) {
    if (value) {
      this.inputFormControl.patchValue(value);
    }
  }

  @HostBinding('class') classList = 'search-bar';

  public clear() {
    this.inputFormControl.reset();
  }


}
