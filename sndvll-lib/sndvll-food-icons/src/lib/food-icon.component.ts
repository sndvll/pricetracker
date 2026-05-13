import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {FoodIcons} from './food-icons';
import {uppercamelcase} from './utils';
import {IconSize, IconWeight, iconWeights, pixelSizes} from '@sndvll/core';

@Component({
  selector: 'food-icon',
  template: '<ng-content></ng-content>'
})
export class FoodIconComponent implements OnChanges {

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
              @Inject(FoodIcons) private icons: FoodIcons) { }


  ngOnChanges(changes: SimpleChanges): void {
    const foodIcons = Object.assign({}, ...(this.icons as any as object[]));
    const svg = foodIcons[uppercamelcase(changes['name'].currentValue)] || '';
    if (!svg) {
      console.warn(`Icon not found: ${changes['name'].currentValue}`);
    }
    this.elem.nativeElement.innerHTML = svg;
    this.strokeWidth = iconWeights[this.weight];
    this.changeDetectorRef.markForCheck();
  }

}
