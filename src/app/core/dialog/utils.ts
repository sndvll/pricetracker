import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  InjectionToken,
  Injector,
  Renderer2,
  Type
} from '@angular/core';
import {Dialog, DialogBackdrop} from './dialog';

export interface AttachedComponents {
  backdrop?: ComponentRef<DialogBackdrop> | null;
  container?: HTMLElement | null;
  dialogs: ComponentRef<Dialog>[];
}

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

}
