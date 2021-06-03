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
import {ConnectedDialog, DialogBackdrop, GlobalDialog} from './dialog';
import {DOCUMENT, Location} from '@angular/common';
import {DialogRef} from './dialog.ref';
import {
  DIALOG_REF,
  DialogConfig,
  DialogType,
} from './dialog.config';
import {DialogUtils} from './dialog.utils';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export interface AttachedComponents {
  backdrop?: ComponentRef<DialogBackdrop> | null;
  container?: HTMLElement | null;
  connectedContainer?: HTMLElement | null;
  dialogs: ComponentRef<GlobalDialog>[];
}

@Injectable({providedIn: 'root'})
export class DialogService {

  private readonly renderer: Renderer2;
  private _attachedComponents: AttachedComponents = { dialogs: [] };

  constructor(private injector: Injector,
              private applicationRef: ApplicationRef,
              private rendererFactory: RendererFactory2,
              private componentFactoryResolver: ComponentFactoryResolver,
              private location: Location,
              @Inject(DOCUMENT) private document: Document) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public open<T, D = any>(config: DialogConfig<T>) {
    console.log(config);
    const dialogRef: DialogRef<T> = new DialogRef<T>(this.location, config);
    const injector = DialogUtils.createInjector(this.injector,[{provide: DIALOG_REF, useValue: dialogRef}]);
    return config.type === DialogType.Connected ?
      this.connectedDialog(config, dialogRef, injector) :
      this.globalDialog(config, dialogRef, injector);
  }

  private connectedDialog<T>(config: DialogConfig<T>, dialogRef: DialogRef<T>, injector: Injector): DialogRef<T> {

    const component = config.component;
    const origin = config.origin;

    const componentRef = this.createComponentRef(component!, injector);
    const connectedDialogRef = this.createConnectedDialogRef(componentRef, injector, origin!);

    let backdropComponentRef: ComponentRef<DialogBackdrop> = DialogUtils.getComponentRef(DialogBackdrop, injector, this.componentFactoryResolver, this.applicationRef);
    this.document.body.appendChild(backdropComponentRef.location.nativeElement);

    const scrollListenerDestroyer = new Subject<void>();
    dialogRef.onScroll$
      .pipe(takeUntil(scrollListenerDestroyer))
      .subscribe(() =>
        DialogUtils.calculateElementPosition(connectedDialogRef.location.nativeElement, origin!.getBoundingClientRect()));

    dialogRef.onClose$
      .subscribe(() => {
        [componentRef, connectedDialogRef, backdropComponentRef]
          .forEach(ref => {
            ref.destroy();
            scrollListenerDestroyer.next();
            scrollListenerDestroyer.complete();
            DialogUtils.detachHtmlElement(this._attachedComponents.connectedContainer!);
          })
      });

    return dialogRef;
  }

  private createConnectedDialogRef<T>(componentRef: ComponentRef<T>, injector: Injector, origin: HTMLElement) {
    const dialogComponentRef = DialogUtils.getComponentRef(ConnectedDialog, injector, this.componentFactoryResolver, this.applicationRef, [[componentRef.location.nativeElement]])
    const container = this.document.createElement('div');
    DialogUtils.addClass(this.renderer, container, 'connected-dialog-container');

    const dialogComponentElement = <HTMLElement>dialogComponentRef.location.nativeElement;
    DialogUtils.calculateElementPosition(dialogComponentElement, origin.getBoundingClientRect())

    container.appendChild(dialogComponentElement);
    this.document.body.appendChild(container);
    this._attachedComponents.connectedContainer = container;
    return dialogComponentRef;
  }

  private globalDialog<T, D>(config: DialogConfig<T, D>, dialogRef: DialogRef<T>, injector: Injector): DialogRef<T> {

    if (this.checkToasts(config.type!)) {
      this._attachedComponents.dialogs.filter(dialog => dialog.instance.role === DialogType.Toast)
        .forEach(dialog => dialog.instance.dialogRef.close());
    }

    if (config.withBackdrop) {
      let backdropComponentRef: ComponentRef<DialogBackdrop> = DialogUtils.getComponentRef(DialogBackdrop, injector, this.componentFactoryResolver, this.applicationRef);
      this.document.body.appendChild(backdropComponentRef.location.nativeElement);
      this._attachedComponents.backdrop = backdropComponentRef;
    }

    const componentRef: ComponentRef<T> = this.createComponentRef(config.component!, injector)
    const dialogComponentRef: ComponentRef<GlobalDialog> = this.createDialogComponentRef(componentRef, injector);

    dialogRef.onClose$
      .subscribe(() => this.close([componentRef, dialogComponentRef], config));

    return dialogRef;
  }

  private createComponentRef<T>(component: Type<T>, injector: Injector) {
    const componentRef: ComponentRef<T> = DialogUtils.getComponentRef(component, injector, this.componentFactoryResolver, this.applicationRef);
    DialogUtils.addClass(this.renderer, componentRef.location.nativeElement, 'dialog-component');
    return componentRef;
  }

  private createDialogComponentRef<T>(componentRef: ComponentRef<T>, injector: Injector) {

    const dialogComponentRef = DialogUtils.getComponentRef(GlobalDialog, injector, this.componentFactoryResolver, this.applicationRef, [[componentRef.location.nativeElement]]);

    if (this._attachedComponents.container) {
      this._attachedComponents.container.appendChild(dialogComponentRef.location.nativeElement);
    } else {
      const root: HTMLElement = this.document.body;
      const container = this.document.createElement('div');
      DialogUtils.addClass(this.renderer, container, 'dialog-container');
      container.appendChild(dialogComponentRef.location.nativeElement);
      root.appendChild(container);
      this._attachedComponents.container = container;
    }

    this._attachedComponents.dialogs.push(dialogComponentRef);

    return dialogComponentRef;
  }

  private removeBackdrop() {
    DialogUtils.detach(this._attachedComponents.backdrop!);
    this._attachedComponents.backdrop = null;
  }

  private checkToasts(type: DialogType) {
    return type === DialogType.Toast &&
      this._attachedComponents.dialogs.some(dialog => dialog.instance.role === DialogType.Toast)
  }

  private close(refs: ComponentRef<any>[], config: DialogConfig<any>): void {

    const dialogComponentRef = refs[1];

    // The dialog that should be removed, should always be removed.
    // First thing to do is to detach it from the body.
    DialogUtils.detach(dialogComponentRef);

    if (this._attachedComponents.dialogs.length > 1) {
      // Remove the one dialog that should be removed out of the array, to keep others open
      // if there is any.
      const index = this._attachedComponents.dialogs.indexOf(dialogComponentRef);
      this._attachedComponents.dialogs.splice(index, 1);

      // So if we have a backdrop open (ie a modal) and opens a toast
      // the backdrop needs to be discarded when closing the modal, but not
      // the toast (toast config.withBackdrop === false)
      if (config.withBackdrop && this._attachedComponents.backdrop) {
        this.removeBackdrop();
      }

    } else {

      if (this._attachedComponents.backdrop) {
        // Remove backdrop if there is one
        refs.push(this._attachedComponents.backdrop);
        // and detach it from the body
        this.removeBackdrop();
      }

      // Remove the container that contains the dialog/s
      DialogUtils.detachHtmlElement(this._attachedComponents.container!);

      this._attachedComponents.container = null;
      this._attachedComponents.dialogs = [];
    }

    // And last, destroy the component refs.
    refs.forEach(ref => ref.destroy());
  }
}
