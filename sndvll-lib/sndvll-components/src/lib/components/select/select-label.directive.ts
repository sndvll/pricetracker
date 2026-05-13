import {Directive, TemplateRef} from '@angular/core';

@Directive({
  selector: '[selectLabel]'
})
export class SelectLabelDirective {

  constructor(public template: TemplateRef<any>) {
  }
}
