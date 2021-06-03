import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  InjectionToken,
  Injector,
  Renderer2,
  Type
} from '@angular/core';
import {DialogConnectedPosition, RepositionEvent} from './dialog.config';

/**
 * Various utils for Dialog creation
 */
export class DialogUtils {

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


  public static getPixelPosition(pixels: number): string {
    return `${pixels}px`
  }

  public static calculateElementPosition(element: HTMLElement, originRect: DOMRect, repositionEvent: RepositionEvent) {
    const {elementRect, position} = repositionEvent;
    const positioning: any = {
      [DialogConnectedPosition.BottomLeft]: () => {
        element.style.top = this.getPixelPosition(originRect.top + originRect.height);
        element.style.left = this.getPixelPosition(originRect.left);
      },
      [DialogConnectedPosition.BottomRight]: () => {
        element.style.top = this.getPixelPosition(originRect.top + originRect.height);
        element.style.left = this.getPixelPosition(originRect.right - elementRect.width);
      },
      [DialogConnectedPosition.BottomMiddle]: () => {
        element.style.top = this.getPixelPosition(originRect.top + originRect.height);
        element.style.left = this.getPixelPosition(originRect.left - ((elementRect.width / 2) - (originRect.width / 2)));
      },
      [DialogConnectedPosition.TopLeft]: () => {
        element.style.top = this.getPixelPosition(originRect.top - elementRect.height);
        element.style.left = this.getPixelPosition(originRect.left);
      },
      [DialogConnectedPosition.TopRight]: () => {
        element.style.top = this.getPixelPosition(originRect.top - elementRect.height);
        element.style.left = this.getPixelPosition(originRect.right - elementRect.width);
      },
      [DialogConnectedPosition.TopMiddle]: () => {
        element.style.top = this.getPixelPosition(originRect.top - elementRect.height) + 'px';
        element.style.left = this.getPixelPosition(originRect.left - ((elementRect.width / 2) - (originRect.width / 2)));
      },
      [DialogConnectedPosition.Left]: () => {
        element.style.top = this.getPixelPosition(originRect.top - (elementRect.height / 2) + (originRect.height / 2));
        element.style.left = this.getPixelPosition(originRect.left - elementRect.width);
      },
      [DialogConnectedPosition.Right]: () => {
        element.style.top = this.getPixelPosition(originRect.top - (elementRect.height / 2) + (originRect.height / 2));
        element.style.left = this.getPixelPosition(originRect.right);
      }
    };

    positioning[position]();

  }

}
