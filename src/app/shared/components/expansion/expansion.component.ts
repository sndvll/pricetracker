import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  HostBinding, HostListener,
  Input,
  Output
} from '@angular/core';
import {expansionAnimations} from './expansion.animations';

let nextUniqueId = 0;


@Component({
  selector: 'sndvll-expansion-header',
  template: `<ng-content></ng-content>`
})
export class ExpansionHeaderComponent {}

@Component({
  selector: 'sndvll-expansion-body',
  template: `<ng-content></ng-content>`
})
export class ExpansionBodyComponent {}

@Component({
  selector: 'sndvll-expansion',
  template: `
    <ng-content select="sndvll-expansion-header"></ng-content>
    <div class="expansion-panel-content"
         [@bodyExpansion]="expandedState" (@bodyExpansion.done)="onChanges.next()">
      <ng-content select="sndvll-expansion-body"></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [expansionAnimations.bodyExpansion]
})
export class ExpansionComponent {

  @HostBinding('class') classList = 'block m-0 overflow-hidden';

  @Output() onChanges: EventEmitter<void> = new EventEmitter<void>();

  @Input() id = nextUniqueId++;

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

  @Input() disabled: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              public elementRef: ElementRef) {
  }

 @HostListener('@bodyExpansion.done', ['$event'])
 private _animationDoneListener(event: AnimationEvent) {
    this.onChanges.next();
 }

  toggle(): void {
    if (!this.disabled) {
      this.expanded = !this.expanded;
    }
  }

  get expandedState(): 'expanded' | 'collapsed'  {
    return this.expanded ? 'expanded' : 'collapsed';
  }
}
