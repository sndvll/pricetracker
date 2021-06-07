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
  connectedBackdrop?: HTMLElement | null;
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

  public open<T, D>(config: DialogConfig<T, D>) {
    const dialogRef: DialogRef<T, D> = new DialogRef<T, D>(this.location, config);
    const injector = DialogUtils.createInjector(this.injector,[{provide: DIALOG_REF, useValue: dialogRef}]);
    return config.type === DialogType.Connected ?
      this._connectedDialog(config, dialogRef, injector) :
      this._globalDialog(config, dialogRef, injector);
  }

  private _connectedDialog<T, D>(config: DialogConfig<T>, dialogRef: DialogRef<T, D>, injector: Injector): DialogRef<T, D> {

    const {component, origin, withBackdrop} = config;

    if (!origin) {
            throw new Error('Got no origin element to position the connected component to. Please check your config and provide an origin from the template.')
    }

    const componentRef = this._createComponentRef(component!, injector);
    const dialogComponentRef = this._createDialogComponentRef(componentRef, injector, true);

    let backdropComponentRef: ComponentRef<DialogBackdrop>;
    if (withBackdrop) {
      backdropComponentRef = DialogUtils.getComponentRef(DialogBackdrop, injector, this.componentFactoryResolver, this.applicationRef);
      this.document.body.appendChild(backdropComponentRef.location.nativeElement);
    }


    const repositionListenerDestroyer = new Subject<void>();
    dialogRef.reposition$
      .pipe(takeUntil(repositionListenerDestroyer))
      .subscribe(repositionEvent => {
        DialogUtils.calculateElementPosition(dialogComponentRef.location.nativeElement, origin!.getBoundingClientRect(), repositionEvent);
      });

    dialogRef.onClose$
      .subscribe(() => {
        const refs: ComponentRef<any>[] = [componentRef, dialogComponentRef];
        if (backdropComponentRef) {
          refs.push(backdropComponentRef);
        }
        refs
          .forEach(ref => {
            ref.destroy();
            repositionListenerDestroyer.next();
            repositionListenerDestroyer.complete();
            DialogUtils.detachHtmlElement(this._attachedComponents.connectedContainer!);
          })
      });

    return dialogRef;
  }

  private _globalDialog<T, D>(config: DialogConfig<T, D>, dialogRef: DialogRef<T, D>, injector: Injector): DialogRef<T, D> {

    const {component, type, withBackdrop, noScroll} = config;

    console.log(config);

    if (type === DialogType.Toast && this._openedToasts()) {
      this._attachedComponents.dialogs.filter(dialog => dialog.instance.role === DialogType.Toast)
        .forEach(dialog => dialog.instance.dialogRef.close());
    }

    if (withBackdrop) {
      let backdropComponentRef: ComponentRef<DialogBackdrop> = DialogUtils.getComponentRef(DialogBackdrop, injector, this.componentFactoryResolver, this.applicationRef);
      this.document.body.appendChild(backdropComponentRef.location.nativeElement);
      this._attachedComponents.backdrop = backdropComponentRef;
    }

    if (noScroll) {
      this.document.body.classList.toggle('overflow-hidden', true);
    }

    const componentRef: ComponentRef<T> = this._createComponentRef(component!, injector)
    const dialogComponentRef = this._createDialogComponentRef(componentRef, injector, false);

    dialogRef.onClose$
      .subscribe(() => {
        this.close([componentRef, dialogComponentRef], withBackdrop!);
        if (noScroll) {
          this.document.body.classList.toggle('overflow-hidden', false);
        }
      });

    return dialogRef;
  }

  private _createComponentRef<T>(component: Type<T>, injector: Injector) {
    const componentRef: ComponentRef<T> = DialogUtils.getComponentRef(component, injector, this.componentFactoryResolver, this.applicationRef);
    DialogUtils.addClass(this.renderer, componentRef.location.nativeElement, 'dialog-component');
    return componentRef;
  }

  private _createDialogComponentRef<T>(componentRef: ComponentRef<T>, injector: Injector, connected: boolean) {

    let dialogComponentRef;
    const container = this.document.createElement('div');
    const root: HTMLElement = this.document.body;

    if (connected) {
      dialogComponentRef = DialogUtils.getComponentRef(ConnectedDialog, injector, this.componentFactoryResolver, this.applicationRef, [[componentRef.location.nativeElement]]);
      DialogUtils.addClass(this.renderer, container, 'connected-dialog-container');

      this._attachedComponents.connectedContainer = container;
      container.appendChild(dialogComponentRef.location.nativeElement);
      root.appendChild(container);
    } else {
      dialogComponentRef = DialogUtils.getComponentRef(GlobalDialog, injector, this.componentFactoryResolver, this.applicationRef, [[componentRef.location.nativeElement]]);
      if (this._attachedComponents.container) {
        this._attachedComponents.container.appendChild(dialogComponentRef.location.nativeElement);
      } else {
        DialogUtils.addClass(this.renderer, container, 'dialog-container');
        this._attachedComponents.container = container;
        container.appendChild(dialogComponentRef.location.nativeElement);
        root.appendChild(container);
      }
      this._attachedComponents.dialogs.push(dialogComponentRef);
    }

    return dialogComponentRef;
  }

  private _removeBackdrop() {
    DialogUtils.detach(this._attachedComponents.backdrop!);
    this._attachedComponents.backdrop = null;
  }

  private _openedToasts() {
    return this._attachedComponents.dialogs.some(dialog => dialog.instance.role === DialogType.Toast)
  }

  private close(refs: ComponentRef<any>[], withBackdrop: boolean): void {

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

      // Remove the container that contains the dialog/s
      DialogUtils.detachHtmlElement(this._attachedComponents.container!);

      this._attachedComponents.container = null;
      this._attachedComponents.dialogs = [];
    }

    // And last, destroy the component refs.
    refs.forEach(ref => ref.destroy());
  }
}
