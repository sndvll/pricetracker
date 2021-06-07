import {Directive, HostBinding} from '@angular/core';

@Directive({
  selector: 'a[sndvll-dropdown-item], button[sndvll-dropdown-item]',
})
export class DropdownMenuItemDirective {

  @HostBinding('class') classList = 'block cursor-pointer items-center py-2 px-3 border-transparent bg-white dark:bg-black text-black dark:text-white border-l-2 hover:bg-gray-50 hover:border-gray-200';

}
