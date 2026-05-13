import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  InjectionToken,
  Injector,
  Renderer2,
  Type
} from '@angular/core';
import {OverlayConnectedPosition, RepositionEvent} from './overlay.config';

/**
 * Various utils for Overlay creation
 */
export class OverlayUtils {

  public static detachHtmlElement(element: HTMLElement): void {
    element?.parentNode?.removeChild(element);
  }

  public static detach<T>(componentRef: ComponentRef<T>): void {
    const element: HTMLElement = componentRef.location.nativeElement;
    this.detachHtmlElement(element);
  }

  public static createInjector(parent: Injector, providers: {provide: InjectionToken<any>, useValue: any}[]) {
    return Injector.create({parent, providers,});
  }

  public static addClass(renderer: Renderer2, element: HTMLElement, clazz: string) {
      renderer.addClass(element, clazz);
  }

  public static getComponentRef<T>(component: Type<T>, injector: Injector, componentFactoryResolver: ComponentFactoryResolver, applicationRef: ApplicationRef, projectableNodes?: any[][]): ComponentRef<T> {
    const componentRef = componentFactoryResolver.resolveComponentFactory(component).create(injector, projectableNodes);
    applicationRef.attachView(componentRef.hostView);
    return componentRef;
  }


  public static getPxValue(pixels: number): string {
    return `${pixels}px`
  }

  public static calculateElementPosition(element: HTMLElement, originRect: DOMRect, repositionEvent: RepositionEvent) {
    const {elementRect, position, parentWide} = repositionEvent;
    if (parentWide) {
      element.style.width = this.getPxValue(originRect.width);
    }
    const positioning: any = {
      [OverlayConnectedPosition.BottomLeft]: () => {
        element.style.top = this.getPxValue(originRect.top + originRect.height);
        element.style.left = this.getPxValue(originRect.left);
      },
      [OverlayConnectedPosition.BottomRight]: () => {
        element.style.top = this.getPxValue(originRect.top + originRect.height);
        element.style.left = this.getPxValue(originRect.right - elementRect.width);
      },
      [OverlayConnectedPosition.BottomMiddle]: () => {
        element.style.top = this.getPxValue(originRect.top + originRect.height);
        element.style.left = this.getPxValue(originRect.left - ((elementRect.width / 2) - (originRect.width / 2)));
      },
      [OverlayConnectedPosition.TopLeft]: () => {
        element.style.top = this.getPxValue(originRect.top - elementRect.height);
        element.style.left = this.getPxValue(originRect.left);
      },
      [OverlayConnectedPosition.TopRight]: () => {
        element.style.top = this.getPxValue(originRect.top - elementRect.height);
        element.style.left = this.getPxValue(originRect.right - elementRect.width);
      },
      [OverlayConnectedPosition.TopMiddle]: () => {
        element.style.top = this.getPxValue(originRect.top - elementRect.height);
        element.style.left = this.getPxValue(originRect.left - ((elementRect.width / 2) - (originRect.width / 2)));
      },
      [OverlayConnectedPosition.Left]: () => {
        element.style.top = this.getPxValue(originRect.top - (elementRect.height / 2) + (originRect.height / 2));
        element.style.left = this.getPxValue(originRect.left - elementRect.width);
      },
      [OverlayConnectedPosition.Right]: () => {
        element.style.top = this.getPxValue(originRect.top - (elementRect.height / 2) + (originRect.height / 2));
        element.style.left = this.getPxValue(originRect.right);
      }
    };

    positioning[position]();

  }

}
