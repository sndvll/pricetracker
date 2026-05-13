import {Directive, HostBinding, Input, OnInit} from '@angular/core';

export type ButtonType = 'button' | 'icon' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'light' | 'dark';

@Directive({
  selector: 'button[sndvll-btn], a[sndvll-btn]',
})
export class ButtonDirective implements OnInit {

  @HostBinding('class') classList = '';

  @Input('sndvll-btn') type: ButtonType = 'button';
  @Input() size: ButtonSize = 'md';
  @Input() color: ButtonColor = 'primary';
  @Input() hover: boolean = true;

  @HostBinding('disabled')
  @Input() disabled = false;

  public ngOnInit() {
    if (this.type === 'button') {
      this.classList = `button btn ${this.size} ${this.color}`;
      if (this.hover && !this.disabled) {
        this.classList = `${this.classList} hover`;
      }
    }
    if (this.type === 'icon') {
      this.classList = 'button icon';
      if (this.hover && !this.disabled) {
        this.classList = `${this.classList} hover`;
      }
    }
    if (this.type === 'link') {
      this.classList = 'button link';
      // Todo check what happens here
      /*if (this.hover && !this.disabled) {
        this.classList = `${this.classList} `;
      }*/
    }
  }

}
