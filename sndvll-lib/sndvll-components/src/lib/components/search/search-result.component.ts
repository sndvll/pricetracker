import {Component, HostBinding, Inject, TemplateRef} from '@angular/core';
import {OVERLAY_REF, OverlayRef} from '@sndvll/core';

export interface SearchResultConfig<T = any> {
  templateRef: TemplateRef<any>;
  width?: string;
  data?: T;
}

@Component({
  template: `<ng-container *ngTemplateOutlet="templateRef"></ng-container>`
})
export class SearchResultComponent {

  public templateRef: TemplateRef<any>;

  @HostBinding('class') classList = 'dropdown-menu bg-white dark:bg-black dark:text-white flex flex-col max-h-96'
  @HostBinding('style.width') width = '';

  constructor(@Inject(OVERLAY_REF) overlayRef: OverlayRef<SearchResultComponent, SearchResultConfig>) {
    const { templateRef, width } = overlayRef.config.data!;
    this.templateRef = templateRef;
    this.width = width!;
  }
}

@Component({
  selector: 'search-result-item',
  template: '<ng-content></ng-content>'
})
export class SearchResultItemComponent {
  @HostBinding('class') classList = 'flex flex-row items-center py-1 px-2';
}
