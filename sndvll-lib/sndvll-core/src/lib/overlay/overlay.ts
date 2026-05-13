import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject
} from '@angular/core';
import {OverlayRef} from './overlay.ref';
import {OVERLAY_REF, OverlayConnectedPosition, OverlayType, OverlayXPosition, OverlayYPosition} from './overlay.config';

@Component({
  template: '',
})
export class OverlayBackdrop {

  @HostBinding('class') classList = '';
  @HostBinding('class.connected') isConnected = this.overlayRef.config.type === OverlayType.Connected;
  @HostBinding('class.pointer-events-none') pointerEventsNone = this.overlayRef.config.backdropClickThrough;
  @HostBinding('class.pointer-events-auto') pointerEventsAuto = !this.overlayRef.config.backdropClickThrough;

  constructor(@Inject(OVERLAY_REF) public overlayRef: OverlayRef) {
    this.classList = `backdrop ${this.overlayRef.config.backdropClass ?? 'bg-black'} opacity-${this.overlayRef.config.backdropOpacity ?? '50'}`;
  }

  @HostListener('click') onBackdropClick() {
    if (this.overlayRef.config.closeOnBackdropClick) {
      this._close();
    }
  }

  @HostListener('document:keydown.escape') onEscKey() {
    this._close();
  }

  private _close() {
    if (this.overlayRef.config.closable) {
      this.overlayRef.close();
    }
  }
}

@Component({
  template: `
    <div class="overlay-content" [class]="overlayRef?.config?.classes">
      <ng-content></ng-content>
    </div>
  `
})
export class GlobalOverlay {

  @HostBinding('class') classList = 'overlay';
  @HostBinding('class.toast') isToast = this.overlayRef.config.type === OverlayType.Toast;
  @HostBinding('class.full') full = this.overlayRef.config.type === OverlayType.Full;
  @HostBinding('class.right') right = this.overlayRef.config.x === OverlayXPosition.Right;
  @HostBinding('class.left') left = this.overlayRef.config.x === OverlayXPosition.Left;
  @HostBinding('class.x-center') xCenter = this.overlayRef.config.x === OverlayXPosition.Center;
  @HostBinding('class.y-middle') yCenter = this.overlayRef.config.y === OverlayYPosition.Middle;
  @HostBinding('class.bottom') bottom = this.overlayRef.config.y === OverlayYPosition.Bottom;
  @HostBinding('class.top') top = this.overlayRef.config.y === OverlayYPosition.Top;
  @HostBinding('class.full-width') fullWidth = this.overlayRef.config.fullWidth;
  @HostBinding('class.full-height') fullHeight = this.overlayRef.config.fullHeight;
  @HostBinding('role') role: OverlayType = OverlayType.Modal;

  constructor(@Inject(OVERLAY_REF) public overlayRef: OverlayRef) {
    this.role = overlayRef.config.type!;
  }
}

@Component({
  template: '<ng-content></ng-content>'
})
export class ConnectedOverlay implements AfterViewInit {

  @HostBinding('class') classList = 'connected-overlay';

  constructor(@Inject(OVERLAY_REF) public overlayRef: OverlayRef,
              private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    this._reposition(this.overlayRef.config.preferredConnectedPosition ?? OverlayConnectedPosition.BottomLeft);
  }

  @HostListener('window:scroll') onScroll() {
    this._reposition(this.overlayRef.config.preferredConnectedPosition ?? OverlayConnectedPosition.BottomLeft);
  }

  @HostListener('window:resize') onResize() {
    this._reposition(this.overlayRef.config.preferredConnectedPosition ?? OverlayConnectedPosition.BottomLeft);
  }

  private _reposition(position: OverlayConnectedPosition) {
    const elementRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
    this.overlayRef.reposition({
      elementRect,
      position,
      parentWide: this.overlayRef.config.parentWide
    });
  }

}
