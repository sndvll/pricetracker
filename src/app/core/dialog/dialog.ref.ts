import {Subject, Subscription, SubscriptionLike} from 'rxjs';
import {Location} from '@angular/common';
import {take} from 'rxjs/operators';
import {DialogConfig, RepositionEvent} from './dialog.config';

/**
 * Dialog reference used to remotely close and dismiss a dialog
 */
export class DialogRef<T = any> {

  private _onClose = new Subject<any>()
  public onClose$ = this._onClose.asObservable().pipe(take(1));

  private _locationChanges: SubscriptionLike = Subscription.EMPTY;

  private _reposition = new Subject<RepositionEvent>();
  public reposition$ = this._reposition.asObservable();

  constructor(
    private location: Location,
    public config: DialogConfig<T>
  ) {
    if (this.config.closeOnNavigationChange) {
      this._locationChanges = this.location
        .subscribe(() => this.close())
    }

  }

  public reposition(event: RepositionEvent) {
    this._reposition.next(event);
  }

  public close() {
    this._destroy();
  }

  public dismiss(reason?: any) {
    this._destroy(reason);
  }

  private _destroy(reason?: any) {
    this._locationChanges.unsubscribe();
    this._onClose.next(reason);
    this._onClose.complete();
    this._reposition.complete();
  }

}
