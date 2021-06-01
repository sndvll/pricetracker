import {Subject, Subscription, SubscriptionLike} from 'rxjs';
import {Location} from '@angular/common';
import {take} from 'rxjs/operators';
import {DialogConfig} from './dialog.config';


export class DialogRef<T = any> {

  private _onClose = new Subject<any>()
  public onClose$ = this._onClose.asObservable().pipe(take(1));

  private _locationChanges: SubscriptionLike = Subscription.EMPTY;

  constructor(
    private location: Location,
    public config: Partial<DialogConfig>
  ) {
    if (this.config.closeOnNavChange) {
      this._locationChanges = this.location
        .subscribe(() => this.close())
    }
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
  }

}
