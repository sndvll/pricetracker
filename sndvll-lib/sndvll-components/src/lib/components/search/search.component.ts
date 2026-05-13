import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {ConnectedOverlayConfigBuilder, OverlayConnectedPosition, OverlayRef, OverlayService} from '@sndvll/core';
import {SearchbarComponent} from './searchbar.component';
import {SearchResultComponent, SearchResultConfig} from './search-result.component';

export type SearchStatus = 'result' | 'noresult' | null;

@Component({
  selector: 'sndvll-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {

  @ViewChild(SearchbarComponent) searchbar!: SearchbarComponent;

  @Input() size = 'md';
  @Input() placeholder: string = '';
  @Input() searchResultRef!: TemplateRef<any>;
  @Output() searchPhrase = new EventEmitter<string>();

  private isOpen: boolean = false;
  private overlayRef!: OverlayRef;

  constructor(private overlay: OverlayService) {}

  public open() {
    const { nativeElement } = this.searchbar.elementRef;
    const overlayConfig = new ConnectedOverlayConfigBuilder<SearchResultComponent, SearchResultConfig>()
      .preferredConnectedPosition(OverlayConnectedPosition.BottomLeft)
      .origin(nativeElement)
      .component(SearchResultComponent)
      .backdropClass('bg-transparent')
      .data({
        templateRef: this.searchResultRef,
        width: `${nativeElement.clientWidth}px`
      })
      .config;
    this.isOpen = true;
    this.overlayRef = this.overlay.open(overlayConfig);
    this.overlayRef.onClose$
      .subscribe(() => {
        this.isOpen = false;
      });
  }

  public onSearch(searchPhrase: string) {
    if (!this.isOpen) {
      this.open();
    }
    this.searchPhrase.emit(searchPhrase);
  }

  public close(selection?: string) {
    if (selection) {
      this.placeholder = selection;
      this.searchbar.clear();
    }
    if (this.overlayRef) {

      this.overlayRef.close();
    }
  }

  public clear() {
    this.searchbar.clear();
  }
}
