import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  RendererFactory2,
  Type
} from '@angular/core';
import {Dialog, DialogBackdrop} from './dialog';
import {DOCUMENT, Location} from '@angular/common';
import {DialogRef} from './dialog.ref';
import {DIALOG_DATA, DIALOG_REF, DialogConfig, DialogType, DialogXPosition, DialogYPosition} from './dialog.config';


export const DEFAULT_CONFIG = <DialogConfig>({
  type: DialogType.Dialog,
  xPosition: DialogXPosition.Center,
  yPosition: DialogYPosition.Center,
  closable: true,
  closeOnNavChange: true,
  data: null,
  backdropColor: 'black'
});

@Injectable({providedIn: 'root'})
export class DialogService {

  constructor(private injector: Injector,
              private applicationRef: ApplicationRef,
              private rendererFactory: RendererFactory2,
              private componentFactoryResolver: ComponentFactoryResolver,
              private location: Location,
              @Inject(DOCUMENT) private document: Document) {}

  public open<T>(component: Type<T>, config: DialogConfig): DialogRef {

    config = {...DEFAULT_CONFIG, ...config};

    const dialogRef: DialogRef = new DialogRef(this.location, config);
    const injector = this._createInjector([
      {provide: DIALOG_REF, useValue: dialogRef},
      {provide: DIALOG_DATA, useValue: config.data},
    ]);

    const componentRef: ComponentRef<T> = this._getComponentRef(component, injector, this.componentFactoryResolver);
    this._addClass(componentRef.location.nativeElement, 'dialog-component');

    const dialogComponentRef: ComponentRef<Dialog> = this._getComponentRef(Dialog, injector, this.componentFactoryResolver, [[componentRef.location.nativeElement]]);
    const backdropComponentRef: ComponentRef<DialogBackdrop> = this._getComponentRef(DialogBackdrop, injector, this.componentFactoryResolver);

    this._attach(dialogComponentRef);
    this._attach(backdropComponentRef);

    dialogRef.onClose$
      .subscribe(() => {
        DialogService._detach(dialogComponentRef);
        DialogService._detach(backdropComponentRef);
        [dialogComponentRef, backdropComponentRef, componentRef]
          .forEach(componentRef => componentRef.destroy());
      });

    return dialogRef;
  }

  private _addClass(element: any, clazz: string): void {
    const renderer = this.rendererFactory.createRenderer(null, null);
    renderer.addClass(element, clazz);
  }

  private _attach<T>(componentRef: ComponentRef<T>): void {
    const root: HTMLElement = this.document.body;
    root.appendChild(componentRef.location.nativeElement);
  }

  private static _detach<T>(componentRef: ComponentRef<T>): void {
    const element: HTMLElement = componentRef.location.nativeElement;
    element?.parentNode?.removeChild(element);
  }

  private _getComponentRef<T>(component: Type<T>, injector: Injector, componentFactoryResolver: ComponentFactoryResolver, projectableNodes?: any[][]): ComponentRef<T> {
    const componentRef = componentFactoryResolver.resolveComponentFactory(component).create(injector, projectableNodes);
    this.applicationRef.attachView(componentRef.hostView);
    return componentRef;
  }

  private _createInjector(providers: {provide: InjectionToken<any>, useValue: any}[]) {
    return Injector.create({
      parent: this.injector,
      providers,
    });
  }

}
