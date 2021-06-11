import {ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
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
export class SelectOptionComponent {

  private _uniqueId = `sndvll-select-${nextUniqueId++}`;
  @Input() id: string = this._uniqueId;

  private _onSelect = new Subject<SelectOptionComponent>();
  public onSelect$ = this._onSelect.asObservable()
    .pipe(take(1));

  @ViewChild(TemplateRef) optionContent!: TemplateRef<any>;
  @ContentChild(SelectLabelDirective) label!: SelectLabelDirective;

  @Input() value: any;

  select() {
    this._onSelect.next(this);
  }
}
