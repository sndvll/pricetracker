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
import {filter, takeUntil} from 'rxjs/operators';


type ExpandedState = 'expanded' | 'collapsed';

let uniqueItemId = 0;

@Component({
  selector: 'sndvll-accordion-item-header',
  template: `
    <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionItemHeaderComponent {}

@Component({
  selector: 'sndvll-accordion-item-content',
  template: `
    <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionItemContentComponent {}


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

  @HostBinding('class') classList = 'accordion-item';

  @Input() id: any = uniqueItemId++;

  private _expanded: boolean = false;
  @Input()
  set expanded(value: boolean) {
    if (this._expanded !== value) {
      this._expanded = value;
      this.changeDetectorRef.markForCheck();
    }
  }

  get expanded() {
    return this._expanded;
  }

  get expandedState(): ExpandedState {
    return this.expanded ? 'expanded' : 'collapsed';
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public toggle() {
    this.expanded = !this.expanded;
    this.onExpandedStateChanges.emit(this.expanded);
  }

  public expand() {
    this.expanded = true;
    this.onExpandedStateChanges.emit(this.expanded);
  }

  public collapse() {
    this.expanded = false;
    this.onExpandedStateChanges.emit(this.expanded);
  }
}

@Component({
  selector: 'sndvll-accordion',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent implements AfterViewInit,  OnDestroy {

  private _onDestroy = new Subject<void>();

  @HostBinding('class') classList = 'accordion';

  @ContentChildren(AccordionItemComponent) items!: QueryList<AccordionItemComponent>;

  public ngAfterViewInit() {
    this.items.forEach((item) => {
      item.onExpandedStateChanges$
        .pipe(
          takeUntil(this._onDestroy),
          filter(v => v)
        )
        .subscribe(() => this.collapseOthers(item.id))
    });
  }

  public collapseOthers(id: any) {
    this.items.filter(item => id !== item.id && item.expanded)
      .forEach(item => item.collapse())
  }

  public ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
