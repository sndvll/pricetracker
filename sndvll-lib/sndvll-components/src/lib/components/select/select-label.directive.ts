import {Directive, TemplateRef} from '@angular/core';

@Directive({
    selector: '[selectLabel]',
    standalone: false
})
export class SelectLabelDirective {

  constructor(public template: TemplateRef<any>) {
  }
}
