import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownMenuComponent} from './dropdown-menu.component';
import {DropdownMenuItemDirective} from './dropdown-menu-item.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DropdownMenuComponent,
    DropdownMenuItemDirective
  ],
  exports: [
    DropdownMenuItemDirective
  ]
})
export class DropdownMenuModule {}
