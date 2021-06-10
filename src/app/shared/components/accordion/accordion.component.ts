import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';
import {expansionAnimations} from './expansion.animations';
import {Subject} from 'rxjs';
import {filter, takeUntil, tap} from 'rxjs/operators';


type ExpandedState = 'expanded' | 'collapsed';

let uniqueItemId = 0;

@Component({
  selector: 'sndvll-accordion-item-header',
  template: `
    <ng-content></ng-content>`
})
export class AccordionItemHeaderComponent {

}

@Component({
  selector: 'sndvll-accordion-item-content',
  template: `
    <ng-content></ng-content>`
})
export class AccordionItemContentComponent {

}


@Component({
  selector: 'sndvll-accordion-item',
  template: `
    <div class="accordion-header" (click)="toggle()">
      <ng-content select="sndvll-accordion-item-header"></ng-content>
    </div>
    <div class="accordion-body"
         [@contentExpansion]="expandedState">
      <ng-content select="sndvll-accordion-item-content"></ng-content>
    </div>
  `,
  animations: [expansionAnimations.contentExpansion],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionItemComponent {

  @Output() onExpandedStateChanges: EventEmitter<boolean> = new EventEmitter<boolean>();
  public onExpandedStateChanges$ = this.onExpandedStateChanges.asObservable();

  @HostBinding('class') classList = 'accordion';

  @Input() id = uniqueItemId++;

  private _expanded: boolean = false;
  @Input()
  set expanded(value: boolean) {
    if (this._expanded !== value) {
      this._expanded = value;
      this.onExpandedStateChanges.next(value);
      this.changeDetectorRef.markForCheck();
    }
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  get expanded() {
    return this._expanded;
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  get expandedState(): ExpandedState {
    return this.expanded ? 'expanded' : 'collapsed';
  }
}

@Component({
  selector: 'sndvll-accordion',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent implements AfterViewInit, OnDestroy {

  private _onDestroy = new Subject<void>();

  @HostBinding('class') classList = 'flex flex-col';

  @ContentChildren(AccordionItemComponent) items!: QueryList<AccordionItemComponent>;

  ngAfterViewInit() {
    this.items.forEach((item) => {
      item.onExpandedStateChanges$
        .pipe(
          takeUntil(this._onDestroy),
          tap(console.log),
          filter(v => v)
        )
        .subscribe(() => this.collapseOthers(item.id))
    });
  }

  collapseOthers(id: number) {
    this.items.filter(item => id !== item.id && item.expanded)
      .forEach(item => item.toggle())
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
