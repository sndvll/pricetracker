import {Component, Directive, HostBinding} from '@angular/core';

@Directive({
    selector: '[cardHeader]',
    standalone: false
})
export class CardHeaderDirective {
  @HostBinding('class') classList = 'card-header';
}

@Directive({
    selector: '[cardContent]',
    standalone: false
})
export class CardContentDirective {
  @HostBinding('class') classList = 'card-content';
}

@Directive({
    selector: '[cardFooter]',
    standalone: false
})
export class CardFooterDirective {}

@Component({
    selector: 'sndvll-card',
    template: '<ng-content></ng-content>',
    standalone: false
})
export class CardComponent {
  @HostBinding('class') classList = 'card';
}
