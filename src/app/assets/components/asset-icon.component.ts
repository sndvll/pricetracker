import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'asset-icon',
  template: `<i class="cf cf-{{shortName}}"></i>`
})
export class AssetIconComponent {

  @HostBinding('class') classList = 'asset-icon';
  @Input() shortName!: string;

}
