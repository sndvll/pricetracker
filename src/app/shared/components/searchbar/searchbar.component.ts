import {Component, ElementRef, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'sndvll-searchbar',
  template: `
    <input
      [placeholder]="placeholder"
      class="focus:outline-none focus:border-hidden focus:ring-0"
      [class]="size"
      [formControl]="inputFormControl"
      (focus)="focus.emit()">
    <ng-container *ngIf="inputFormControl.value">
      <div class="searchbar-clear-button-container"
           [class]="size">
        <button class="searchbar-clear-button"
                [class]="size"
                (click)="clear()">
          <icon name="x" weight="bold"></icon>
        </button>
      </div>
    </ng-container>
    <div class="searchbar-search-icon" [class]="size">
        <icon name="search" [size]="'sm'" weight="bold"></icon>
    </div>
  `
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
