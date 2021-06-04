import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {Icons} from './icons';
import {uppercamelcase} from './utils';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '1rem' | '1.25rem' | '1.5rem' | '1.75rem' | '2rem';

const pixelSizes = {
  xs: '14px',
  sm: '18px',
  md: '20px',
  lg: '22px',
  xl: '24px',
}

@Component({
  selector: 'icon',
  template: '<ng-content></ng-content>'
})
export class IconComponent implements OnChanges {

  @Input() name!: string;

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
  @HostBinding('style.stroke-width') strokeWidth = '2px';
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
    this.changeDetectorRef.markForCheck();
  }

}
