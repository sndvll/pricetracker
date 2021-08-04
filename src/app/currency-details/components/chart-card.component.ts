import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter, HostBinding,
  Input, OnDestroy, OnInit,
  Output, TemplateRef,
  ViewChild
} from '@angular/core';
import {Chart, ChartType, TimeSpan} from '../interfaces';
import {DropdownMenuService} from '../../shared';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'chart-card',
  templateUrl: './chart-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartCardComponent implements OnInit, OnDestroy {

  private _onDestroy: Subject<void> = new Subject<void>();

  public formControl!: FormControl;

  @ViewChild('chartContainer') chartsContainer!: ElementRef;

  @Output() onTimeSpanChange = new EventEmitter<{timeSpan: TimeSpan, type: ChartType}>()
  @Output() onDailyToggle= new EventEmitter<{daily: boolean, timeSpan: TimeSpan, type: ChartType}>();

  public TimeSpan = TimeSpan;
  @Input() timeSpan: TimeSpan = TimeSpan.Month;
  @Input() chart!: Chart[];
  @Input() header!: string;
  @Input() type!: ChartType;
  @Input() daily!: boolean;

  @HostBinding('class') classList = 'select-none'

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private dropdown: DropdownMenuService) {

  }

  ngOnInit() {
    this.formControl = new FormControl(this.daily);
    this.formControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((daily: boolean) => this.onDailyToggle.emit({
        daily,
        timeSpan: this.timeSpan,
        type: this.type
      }));
  }

  public openContextMenu(origin: HTMLElement, dropdown: TemplateRef<any>) {
    this.dropdown.open(origin, dropdown);
  }

  setTimeSpan(timeSpan: TimeSpan) {
    this.timeSpan = timeSpan;
    this.onTimeSpanChange.emit({timeSpan, type: this.type})
    this.changeDetectorRef.markForCheck();
  }

  get chartWidth() {
    return this.chartsContainer?.nativeElement?.clientWidth;
  }

  get chartHeight() {
    return this.chartWidth < 500 ? 150 : 200;
  }

  get showYAxis() {
    return false; //this.chartWidth > 500;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
