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
import {Chart, ChartType, TimeSpan} from '../types';
import {DropdownMenuService} from '../../shared';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'chart-card',
  template: `
    <card class="w-full my-2">
      <div class="justify-between px-3 items-center" cardHeader>
        <h1 class="font-bold text-xl">{{header}}</h1>
        <div class="py-2 flex flex-row items-center justify-end">
          <button sndvll-btn="button" size="xs" class="mr-1"
                  [class.light]="timeSpan !== TimeSpan.Year"
                  [class.dark]="timeSpan === TimeSpan.Year"
                  (click)="setTimeSpan(TimeSpan.Year)">1Y</button>
          <button sndvll-btn="button" size="xs" class="mx-1"
                  [class.light]="timeSpan !== TimeSpan.Month"
                  [class.dark]="timeSpan === TimeSpan.Month"
                  (click)="setTimeSpan(TimeSpan.Month)">1M</button>
          <button sndvll-btn="button" size="xs" class="mx-1"
                  [class.light]="timeSpan !== TimeSpan.Week"
                  [class.dark]="timeSpan === TimeSpan.Week"
                  (click)="setTimeSpan(TimeSpan.Week)">1W</button>
          <button sndvll-btn="button" size="xs" class="ml-1"
                  [class.light]="timeSpan !== TimeSpan.Day"
                  [class.dark]="timeSpan === TimeSpan.Day"
                  (click)="setTimeSpan(TimeSpan.Day)">24h</button>
          <button sndvll-btn="icon" (click)="openContextMenu(contextMenuButton, contextMenu)" #contextMenuButton>
            <icon name="more-vertical" weight="bold"></icon>
          </button>
        </div>
      </div>
      <div class="inline-block w-full" cardContent #chartContainer>
        <ngx-charts-line-chart
          [autoScale]="true"
          [view]="[chartWidth, chartHeight]"
          [gradient]="true"
          [showGridLines]="false"
          [results]="chart"
          [xAxis]="true"
          [timeline]="false"
          [yAxis]="showYAxis"
          [legend]="false">
        </ngx-charts-line-chart>
      </div>
    </card>
    <ng-template #contextMenu>
      <div class="py-2 px-3 bg-white dark:bg-black">
        <sndvll-toggle [formControl]="formControl">Daily</sndvll-toggle>
      </div>
    </ng-template>
  `,
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
