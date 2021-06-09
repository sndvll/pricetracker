import {Injectable} from '@angular/core';
import {ExpansionComponent} from './expansion.component';

@Injectable({providedIn: 'root'})
export class ExpansionService {

  private isExpanded!: ExpansionComponent;

  toggle(expansion: ExpansionComponent) {
    if (this.isExpanded && this.isExpanded.id !== expansion.id) {
      this.isExpanded.toggle();
    }
    expansion.toggle();
    this.isExpanded = expansion;
  }

}
