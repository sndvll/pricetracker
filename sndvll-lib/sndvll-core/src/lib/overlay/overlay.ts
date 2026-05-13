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
    standalone: false
})
export class OverlayBackdrop {

  @HostBinding('class') classList = '';
  @HostBinding('class.connected') isConnected = false;
  @HostBinding('class.pointer-events-none') pointerEventsNone = false;
  @HostBinding('class.pointer-events-auto') pointerEventsAuto = false;

  constructor(@Inject(OVERLAY_REF) public overlayRef: OverlayRef) {
    this.classList = `backdrop ${this.overlayRef.config.backdropClass ?? 'bg-black'} opacity-${this.overlayRef.config.backdropOpacity ?? '50'}`;
    this.isConnected = this.overlayRef.config.type === OverlayType.Connected;
    this.pointerEventsNone = !!this.overlayRef.config.backdropClickThrough;
    this.pointerEventsAuto = !this.overlayRef.config.backdropClickThrough;
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
  `,
    standalone: false
})
export class GlobalOverlay {

  @HostBinding('class') classList = 'overlay';
  @HostBinding('class.toast') isToast = false;
  @HostBinding('class.full') full = false;
  @HostBinding('class.right') right = false;
  @HostBinding('class.left') left = false;
  @HostBinding('class.x-center') xCenter = false;
  @HostBinding('class.y-middle') yCenter = false;
  @HostBinding('class.bottom') bottom = false;
  @HostBinding('class.top') top = false;
  @HostBinding('class.full-width') fullWidth = false;
  @HostBinding('class.full-height') fullHeight = false;
  @HostBinding('role') role: OverlayType = OverlayType.Modal;

  constructor(@Inject(OVERLAY_REF) public overlayRef: OverlayRef) {
    this.isToast = this.overlayRef.config.type === OverlayType.Toast;
    this.full = this.overlayRef.config.type === OverlayType.Full;
    this.right = this.overlayRef.config.x === OverlayXPosition.Right;
    this.left = this.overlayRef.config.x === OverlayXPosition.Left;
    this.xCenter = this.overlayRef.config.x === OverlayXPosition.Center;
    this.yCenter = this.overlayRef.config.y === OverlayYPosition.Middle;
    this.bottom = this.overlayRef.config.y === OverlayYPosition.Bottom;
    this.top = this.overlayRef.config.y === OverlayYPosition.Top;
    this.fullWidth = !!this.overlayRef.config.fullWidth;
    this.fullHeight = !!this.overlayRef.config.fullHeight;
    this.role = overlayRef.config.type!;
  }
}

@Component({
    template: '<ng-content></ng-content>',
    standalone: false
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
