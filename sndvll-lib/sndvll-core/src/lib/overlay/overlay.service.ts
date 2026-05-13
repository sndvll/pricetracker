import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  Renderer2,
  RendererFactory2,
  Type
} from '@angular/core';
import {ConnectedOverlay, OverlayBackdrop, GlobalOverlay} from './overlay';
import {DOCUMENT, Location} from '@angular/common';
import {OverlayRef} from './overlay.ref';
import {
  OVERLAY_REF,
  OverlayConfig,
  OverlayType,
} from './overlay.config';
import {OverlayUtils} from './overlay.utils';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export interface AttachedComponents {
  backdrop?: ComponentRef<OverlayBackdrop> | null;
  container?: HTMLElement | null;
  connectedContainer?: HTMLElement | null;
  connectedBackdrop?: HTMLElement | null;
  overlays: ComponentRef<GlobalOverlay>[];
}

@Injectable({providedIn: 'root'})
export class OverlayService {

  private readonly renderer: Renderer2;
  private _attachedComponents: AttachedComponents = { overlays: [] };

  constructor(private injector: Injector,
              private applicationRef: ApplicationRef,
              private rendererFactory: RendererFactory2,
              private componentFactoryResolver: ComponentFactoryResolver,
              private location: Location,
              @Inject(DOCUMENT) private document: Document) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public open<T, D>(config: OverlayConfig<T, D>) {
    const overlayRef: OverlayRef<T, D> = new OverlayRef<T, D>(this.location, config);
    const injector = OverlayUtils.createInjector(this.injector,[{provide: OVERLAY_REF, useValue: overlayRef}]);
    return config.type === OverlayType.Connected ?
      this._connectedOverlay(config, overlayRef, injector) :
      this._globalOverlay(config, overlayRef, injector);
  }

  private _connectedOverlay<T, D>(config: OverlayConfig<T>, overlayRef: OverlayRef<T, D>, injector: Injector): OverlayRef<T, D> {

    const {component, origin, withBackdrop} = config;

    if (!origin) {
            throw new Error('Got no origin element to position the connected component to. Please check your config and provide an origin from the template.')
    }

    const componentRef = this._createComponentRef(component!, injector);
    const overlayComponentRef = this._createOverlayComponentRef(componentRef, injector, true);

    let backdropComponentRef: ComponentRef<OverlayBackdrop>;
    if (withBackdrop) {
      backdropComponentRef = OverlayUtils.getComponentRef(OverlayBackdrop, injector, this.componentFactoryResolver, this.applicationRef);
      this.document.body.appendChild(backdropComponentRef.location.nativeElement);
    }


    const repositionListenerDestroyer = new Subject<void>();
    overlayRef.reposition$
      .pipe(takeUntil(repositionListenerDestroyer))
      .subscribe(repositionEvent => {
        OverlayUtils.calculateElementPosition(overlayComponentRef.location.nativeElement, origin!.getBoundingClientRect(), repositionEvent);
      });

    overlayRef.onClose$
      .subscribe(() => {
        const refs: ComponentRef<any>[] = [componentRef, overlayComponentRef];
        if (backdropComponentRef) {
          refs.push(backdropComponentRef);
        }
        refs
          .forEach(ref => {
            ref.destroy();
            repositionListenerDestroyer.next();
            repositionListenerDestroyer.complete();
            OverlayUtils.detachHtmlElement(this._attachedComponents.connectedContainer!);
          })
      });

    return overlayRef;
  }

  private _globalOverlay<T, D>(config: OverlayConfig<T, D>, overlayRef: OverlayRef<T, D>, injector: Injector): OverlayRef<T, D> {

    const {component, type, withBackdrop, noScroll} = config;

    if (type === OverlayType.Toast && this._openedToasts()) {
      this._attachedComponents.overlays.filter(overlay => overlay.instance.role === OverlayType.Toast)
        .forEach(overlay => overlay.instance.overlayRef.close());
    }

    if (withBackdrop) {
      let backdropComponentRef: ComponentRef<OverlayBackdrop> = OverlayUtils.getComponentRef(OverlayBackdrop, injector, this.componentFactoryResolver, this.applicationRef);
      this.document.body.appendChild(backdropComponentRef.location.nativeElement);
      this._attachedComponents.backdrop = backdropComponentRef;
    }

    if (noScroll) {
      this.document.body.classList.toggle('overflow-hidden', true);
    }

    const componentRef: ComponentRef<T> = this._createComponentRef(component!, injector)
    const overlayComponentRef = this._createOverlayComponentRef(componentRef, injector, false);

    overlayRef.onClose$
      .subscribe(() => {
        this.close([componentRef, overlayComponentRef], withBackdrop!);
        if (noScroll) {
          this.document.body.classList.toggle('overflow-hidden', false);
        }
      });

    return overlayRef;
  }

  private _createComponentRef<T>(component: Type<T>, injector: Injector) {
    const componentRef: ComponentRef<T> = OverlayUtils.getComponentRef(component, injector, this.componentFactoryResolver, this.applicationRef);
    OverlayUtils.addClass(this.renderer, componentRef.location.nativeElement, 'overlay-component');
    return componentRef;
  }

  private _createOverlayComponentRef<T>(componentRef: ComponentRef<T>, injector: Injector, connected: boolean) {

    let overlayComponentRef;
    const container = this.document.createElement('div');
    const root: HTMLElement = this.document.body;

    if (connected) {
      overlayComponentRef = OverlayUtils.getComponentRef(ConnectedOverlay, injector, this.componentFactoryResolver, this.applicationRef, [[componentRef.location.nativeElement]]);
      OverlayUtils.addClass(this.renderer, container, 'connected-overlay-container');

      this._attachedComponents.connectedContainer = container;
      container.appendChild(overlayComponentRef.location.nativeElement);
      root.appendChild(container);
    } else {
      overlayComponentRef = OverlayUtils.getComponentRef(GlobalOverlay, injector, this.componentFactoryResolver, this.applicationRef, [[componentRef.location.nativeElement]]);
      if (this._attachedComponents.container) {
        this._attachedComponents.container.appendChild(overlayComponentRef.location.nativeElement);
      } else {
        OverlayUtils.addClass(this.renderer, container, 'overlay-container');
        this._attachedComponents.container = container;
        container.appendChild(overlayComponentRef.location.nativeElement);
        root.appendChild(container);
      }
      this._attachedComponents.overlays.push(overlayComponentRef);
    }

    return overlayComponentRef;
  }

  private _removeBackdrop() {
    OverlayUtils.detach(this._attachedComponents.backdrop!);
    this._attachedComponents.backdrop = null;
  }

  private _openedToasts() {
    return this._attachedComponents.overlays.some(overlay => overlay.instance.role === OverlayType.Toast)
  }

  private close(refs: ComponentRef<any>[], withBackdrop: boolean): void {

    const overlayComponentRef = refs[1];

    // The overlay that should be removed, should always be removed.
    // First thing to do is to detach it from the body.
    OverlayUtils.detach(overlayComponentRef);

    if (this._attachedComponents.overlays.length > 1) {
      // Remove the one overlay that should be removed out of the array, to keep others open
      // if there is any.
      const index = this._attachedComponents.overlays.indexOf(overlayComponentRef);
      this._attachedComponents.overlays.splice(index, 1);

      // So if we have a backdrop open (ie a modal) and opens a toast
      // the backdrop needs to be discarded when closing the modal, but not
      // the toast (toast config.withBackdrop === false)
      if (withBackdrop && this._attachedComponents.backdrop) {
        this._removeBackdrop();
      }

    } else {

      if (this._attachedComponents.backdrop) {
        // Remove backdrop if there is one
        refs.push(this._attachedComponents.backdrop);
        // and detach it from the body
        this._removeBackdrop();
      }

      // Remove the container that contains the overlay/s
      OverlayUtils.detachHtmlElement(this._attachedComponents.container!);

      this._attachedComponents.container = null;
      this._attachedComponents.overlays = [];
    }

    // And last, destroy the component refs.
    refs.forEach(ref => ref.destroy());
  }
}
