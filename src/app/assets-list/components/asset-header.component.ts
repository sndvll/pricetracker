import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {AppStore, AssetModel} from '../../store';
import {Color} from '../../core';
import {EventBusService, EventType} from '../../core/event/event-bus.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'asset-header',
  templateUrl: './asset-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetHeaderComponent implements OnInit, OnDestroy {

  private _onDestroy = new Subject();

  @HostBinding('class') classList = 'grid grid-cols-7 grid-flow-col auto-cols-min';

  @Input() asset!: AssetModel;

  public rate!: number;
  public marketChange!: number;
  public negativeChange!: boolean;

  constructor(private store: AppStore,
              private event: EventBusService,
              private changeDetectorRef: ChangeDetectorRef) {}


  ngOnInit() {
    this.event.on([EventType.PRICE])
      .pipe(
        takeUntil(this._onDestroy)
      )
      .subscribe(() => {
        this.rate = this.store.getCurrentRate(this.asset.id);
        this.marketChange = this.store.getCurrentPriceChangePercentage(this.asset.id);
        this.negativeChange = this.marketChange < 0
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  get iconTextColor() {
    if (this.asset.color === Color.white) {
      return `text-black dark:text-black`;
    }
    if (this.asset.color === Color.black) {
      return `text-white dark:text-white`;
    }
    return `text-gray-600 dark:text-gray-100`;
  }



  get iconBgColor() {
    return this.asset.color === Color.white ||
      this.asset.color === Color.black ?
      `bg-${this.asset.color} dark:bg-${this.asset.color}` :
      `bg-${this.asset.color}-300 dark:bg-${this.asset.color}-400`;
  }
}
