import {Inject, Injectable} from '@angular/core';
import {fromEvent} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {last, map, repeat, switchMap, takeUntil, takeWhile, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PullToRefreshService {

  private touchStart$ = fromEvent<TouchEvent>(this.document, 'touchstart');
  private touchEnd$ = fromEvent<TouchEvent>(this.document, 'touchend');
  private touchMove$ = fromEvent<TouchEvent>(this.document, 'touchmove');

  constructor(@Inject(DOCUMENT) private document: Document) {}

  public get onDrag$() {
    return this.touchStart$
      .pipe(
        switchMap(start => {
          let pos = 0;
          return this.touchMove$
            .pipe(
              map(move => move.touches[0].pageY - start.touches[0].pageY),
              tap(p => (pos = p)),
              takeUntil(this.touchEnd$))
        }),
        takeWhile(p => p < window.innerHeight / 6),
        last(),
        repeat()
      );
  }

}
