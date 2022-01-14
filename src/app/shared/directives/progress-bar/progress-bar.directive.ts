import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {interval} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';

@Directive({
  selector: 'div[progress-bar]',
})
export class ProgressBarDirective implements OnInit {

  @Output() onTimeout: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('style.width') private _progress = '0%';

  @Input() timer: boolean = false;
  @Input() total: number = 100;
  @Input() time: number = 0;

  @Input() set progress(value: number) {
    this._progress = value + '%';
    this.changeDetectorRef.markForCheck();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit() {
    if (this.timer && this.time) {
      this._startTimer();
    }
  }

  private _startTimer() {
    // This does not work when changing time setting..
    // It depends on that this.total gets to 100%, which it will never when setting
    // time to let's say 5.
    // This is a very stupid solution. Fix it. TODO
    this.total = (this.time * 10);
    interval(100)
      .pipe(
        take(this.time * 10),
        map(time => {
          this.progress = (time + 1);
          return time + 1;
        }),
        filter(v => v === (this.total)))
      .subscribe(() => this.onTimeout.emit())
  }

}
