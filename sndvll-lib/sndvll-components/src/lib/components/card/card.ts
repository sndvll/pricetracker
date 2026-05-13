import {Component, Directive, HostBinding} from '@angular/core';

@Directive({
  selector: '[cardHeader]'
})
export class CardHeaderDirective {
  @HostBinding('class') classList = 'card-header';
}

@Directive({
  selector: '[cardContent]'
})
export class CardContentDirective {
  @HostBinding('class') classList = 'card-content';
}

@Directive({
  selector: '[cardFooter]'
})
export class CardFooterDirective {}

@Component({
  selector: 'sndvll-card',
  template: '<ng-content></ng-content>'
})
export class CardComponent {
  @HostBinding('class') classList = 'card';
}
