import {ChangeDetectorRef, Component, ElementRef, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Icons} from './icons';
import {uppercamelcase} from './utils';

@Component({
  selector: 'icon',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      display: inline-block;
      width: 24px;
      height: 24px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `]
})
export class IconComponent implements OnChanges {
  @Input() name!: string;

  constructor(@Inject(ElementRef) private elem: ElementRef,
              @Inject(ChangeDetectorRef) private changeDetectorRef: ChangeDetectorRef,
              @Inject(Icons) private icons: Icons) { }

  ngOnChanges(changes: SimpleChanges): void {
    const icons = Object.assign({}, ...(this.icons as any as object[]));
    const svg = icons[uppercamelcase(changes.name.currentValue)] || '';
    if (!svg) {
      console.warn(`Icon not found: ${changes.name.currentValue}`);
    }
    this.elem.nativeElement.innerHTML = svg;
    this.changeDetectorRef.markForCheck();
  }

}
