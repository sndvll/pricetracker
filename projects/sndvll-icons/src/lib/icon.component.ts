import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnChanges, OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {Icons} from './icons';
import {uppercamelcase} from './utils';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '1rem' | '1.25rem' | '1.5rem' | '1.75rem' | '2rem';
export type IconWeight = 'normal' | 'bold' | 'bolder';

const pixelSizes = {
  xs: '14px',
  sm: '18px',
  md: '20px',
  lg: '22px',
  xl: '24px',
}

const iconWeights = {
  normal: '2px',
  bold: '3px',
  bolder: '4px'
}

@Component({
  selector: 'icon',
  template: '<ng-content></ng-content>'
})
export class IconComponent implements OnChanges {

  @Input() name!: string;
  @Input() weight: IconWeight = 'normal';

  @Input()
  public set size(size: IconSize) {
    // @ts-ignore
    let selectedSize = pixelSizes[size];
    if (!selectedSize) {
      selectedSize = size;
    }
    if (selectedSize) {
      this.width = selectedSize;
      this.height = selectedSize;
    }
  }

  @HostBinding('style.width') width = '1rem';
  @HostBinding('style.height') height = '1rem;'
  @HostBinding('style.display') display = 'inline-block';
  @HostBinding('style.fill') fill = 'none';
  @HostBinding('style.stroke') stroke = 'currentColor';
  @HostBinding('style.stroke-width') strokeWidth = iconWeights['normal'];
  @HostBinding('style.stroke-linecap') strokeLinecap = 'round';
  @HostBinding('style.stroke-linejoin') strokeLinejoin = 'round';

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
    this.strokeWidth = iconWeights[this.weight];
    this.changeDetectorRef.markForCheck();
  }

}
