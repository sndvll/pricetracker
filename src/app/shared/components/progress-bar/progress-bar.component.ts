import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {interval} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';

@Component({
  selector: 'progress-bar',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent implements OnInit {

  @Input() timer: boolean = false;
  @Input() total!: number;
  @Input() time: number = 0;

  @Output() onTimeout: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('style.width') private _progress = '0%';

  @Input() set progress(value: number) {
    this._progress = value + '%';
    this.changeDetectorRef.markForCheck();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.timer && this.time) {
      this._startTimer();
    }
  }

  private _startTimer() {
    this.total = this.time * 10;
    interval(100)
      .pipe(
        take(this.time * 10),
        map(time => {
          this.progress = (time + 1);
          return  time + 1;
        }),
        filter(v => v === (this.total)))
      .subscribe(() => this.onTimeout.emit())
  }

}
