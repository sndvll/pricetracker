import {BehaviorSubject, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Injectable} from '@angular/core';

export enum EventType {
  PRICE = 'price',
  INIT = 'init',
  EMPTY = 'e'
}

interface Event {
  type: EventType
}

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private _onEvent$: BehaviorSubject<Event> = new BehaviorSubject<Event>({type: EventType.EMPTY});

  public next(type: EventType) {
    this._onEvent$.next({type});
  }

  public on(types: EventType[]): Observable<Event> {
    return this._onEvent$.asObservable().pipe(
      filter(event => types.some(type => type === event.type))
    );
  }
}
