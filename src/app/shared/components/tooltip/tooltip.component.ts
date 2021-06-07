import {Component, HostBinding, Inject} from '@angular/core';
import {DIALOG_REF, DialogRef} from '../../../core/dialog';

@Component({
  template: `
    {{message}}
    <svg class="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
  `
})
export class TooltipComponent {

  public message: string = '';

  @HostBinding('class') classList = 'py-1 px-3 bg-black rounded text-white text-sm shadow-lg font-bold'

  constructor(@Inject(DIALOG_REF) public dialogRef: DialogRef<TooltipComponent, string>) {
    this.message = dialogRef.config.data!;
  }

}
