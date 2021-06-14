import {ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewChild} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {SelectLabelDirective} from './select-label.directive';

let nextUniqueId = 0;

@Component({
  selector: 'sndvll-select-option',
  template: `
    <ng-template>
      <div class="select-option" (click)="select()">
        <ng-container *ngIf="label" [ngTemplateOutlet]="label.template"></ng-container>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectOptionComponent<T> {

  private _uniqueId = `sndvll-select-${nextUniqueId++}`;

  private _onSelect = new Subject<SelectOptionComponent<T>>();
  public onSelect$: Observable<SelectOptionComponent<T>> = this._onSelect.asObservable()
    .pipe(take(1));

  @ViewChild(TemplateRef) optionContent!: TemplateRef<any>;
  @ContentChild(SelectLabelDirective) label!: SelectLabelDirective;

  @Input() value!: T;
  @Input() id: string = this._uniqueId;

  public select() {
    this._onSelect.next(this);
  }
}
