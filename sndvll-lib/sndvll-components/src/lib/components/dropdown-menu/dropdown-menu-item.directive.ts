import {Directive, HostBinding} from '@angular/core';

@Directive({
    selector: 'a[sndvll-dropdown-item], button[sndvll-dropdown-item]',
    standalone: false
})
export class DropdownMenuItemDirective {

  @HostBinding('class') classList = 'dropdown-menu-item';

}
