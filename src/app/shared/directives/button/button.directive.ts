import {Directive, HostBinding, Input, OnInit} from '@angular/core';

export type ButtonType = 'button' | 'icon' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
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

  private _sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3',
    lg: 'px-5 py-4 text-lg'
  }

  private _types = {
    button: 'rounded focus:outline-none leading-none',
    icon: 'h-8 w-8 rounded focus:outline-none',
    link: 'cursor-pointer rounded focus:outline-none leading-none'
  }

  private _colors = {
    primary: 'bg-blue-300 hover:bg-blue-500 dark:bg-blue-800 dark:hover:bg-blue-900 text-white',
    secondary: 'bg-gray-300 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800 text-white',
    success: 'bg-green-300 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white',
    danger: 'bg-red-300 hover:bg-red-600 dark:bg-red-800 dark:hover:bg-red-900 text-white',
    warning: 'bg-yellow-300 hover:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white',
    light: 'bg-gray-100 hover:bg-gray-300 text-black',
    dark: 'bg-gray-700 dark:bg-gray-900 hover:bg-gray-800 dark:hover:bg-black text-white',
  }

  ngOnInit() {
    if (this.type === 'button') {
      this.classList = `${this._types[this.type]} ${this._sizes[this.size]} ${this._colors[this.color]}`;
    }
    if (this.type === 'icon') {
      this.classList = `${this._types['icon']} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700`;
    }
    if (this.type === 'link') {
      this.classList = `${this._types[this.type]} bg-transparent text-indigo-400 hover:text-indigo-700`;
    }
  }

}
