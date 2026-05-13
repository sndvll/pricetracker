import {Subject, Subscription, SubscriptionLike} from 'rxjs';
import {Location} from '@angular/common';
import {take} from 'rxjs/operators';
import {OverlayConfig, RepositionEvent} from './overlay.config';

/**
 * Overlay reference used to remotely close and dismiss an overlay
 */
export class OverlayRef<T= any, D = any> {

  private _onClose = new Subject<any>()
  public onClose$ = this._onClose.asObservable().pipe(take(1));

  private _locationChanges: SubscriptionLike = Subscription.EMPTY;

  private _reposition = new Subject<RepositionEvent>();
  public reposition$ = this._reposition.asObservable();

  private _checkPosition = new Subject<void>();
  public checkPosition$ = this._checkPosition.asObservable();

  constructor(
    private location: Location,
    public config: OverlayConfig<T, D>
  ) {
    if (this.config.closeOnNavigationChange) {
      this._locationChanges = this.location
        .subscribe(() => this.close())
    }

  }

  public reposition(event: RepositionEvent) {
    this._reposition.next(event);
  }

  public checkPosition() {
    console.log('about to check position');
    this._checkPosition.next();
  }

  public close() {
    this._destroy();
  }

  public dismiss<R = any>(reason?: R) {
    this._destroy(reason);
  }

  private _destroy(reason?: any) {
    this._locationChanges.unsubscribe();
    this._onClose.next(reason);
    this._onClose.complete();
    this._reposition.complete();
    this._checkPosition.complete();
  }

}
