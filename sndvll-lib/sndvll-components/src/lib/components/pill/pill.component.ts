import {Component, HostBinding, Input} from '@angular/core';
import {Color, ColorHue, ColorUtils} from '@sndvll/core';

@Component({
  selector: 'sndvll-pill',
  templateUrl: './pill.component.html'
})
export class PillComponent {

  static defaultClasses = 'rounded-3xl text-xs font-bold';
  static defaultSize = 'px-2 py-1 '

  @HostBinding('class') classes = PillComponent.defaultClasses;
  public currentSize = PillComponent.defaultSize;

  @Input() set color(color: Color) {
    let colorClasses = ColorUtils.color(color, this.hue, true);

    if (color === Color.black) {
      colorClasses = ColorUtils.black(true);
    }

    if (color === Color.white) {
      colorClasses = ColorUtils.white(true);
    }

    this.classes = `${this.classes} ${this.currentSize} ${colorClasses}`;
  }
  @Input() hue: ColorHue = '500';

  @Input() set size(size: 'sm' | 'lg') {
    if  (size === 'sm') {
      this.currentSize = PillComponent.defaultSize;
    }
    if (size === 'lg') {
      this.currentSize = 'px-3 py-2';
    }
    this.classes = `${this.classes} ${this.currentSize}`;
  }
}
