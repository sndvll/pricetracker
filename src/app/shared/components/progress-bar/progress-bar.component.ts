import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'progress-bar',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  @Input() set progress(value: number) {
    this.width = value + '%';
    this.changeDetectorRef.markForCheck();
  }
  @Input() total!: number;

  @HostBinding('style.width') width = '0%';
}
