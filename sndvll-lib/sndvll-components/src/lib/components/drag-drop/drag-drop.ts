import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[dragItem]'
})
export class DragItem {

  @HostBinding('class') classList = 'dragdrop-item';

  @HostListener('touchstart', ['$event'])
  touchStart(event: TouchEvent) {
    event.stopPropagation();
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(event: MouseEvent) {
    event.stopPropagation();
  }
}

@Directive({
  selector: '[dragContainer]'
})
export class DragContainer {

  @HostBinding('class') classList = 'drag-container';

}

