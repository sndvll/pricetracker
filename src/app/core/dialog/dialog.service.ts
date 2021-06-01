import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  Injector, Renderer2,
  RendererFactory2,
  Type
} from '@angular/core';
import {Dialog, DialogBackdrop} from './dialog';
import {DOCUMENT, Location} from '@angular/common';
import {DialogRef} from './dialog.ref';
import {DIALOG_DATA, DIALOG_REF, DialogConfig, DialogConfigBuilder, DialogType,} from './dialog.config';
import {AttachedComponents, DialogUtils} from './utils';

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

  /**
   * Opens a new dialog
   * @param component
   * @param config
   */
  public open<T>(component: Type<T>, config: Partial<DialogConfig> = {}): DialogRef {

    if (this.checkToasts(config.type!)) {
      this._attachedComponents.dialogs.filter(dialog => dialog.instance.role === DialogType.Toast)
        .forEach(dialog => dialog.instance.dialogRef.close());
    }

    config = {...DialogConfigBuilder.Default(), ...config};

    const dialogRef: DialogRef<T> = new DialogRef<T>(this.location, config);
    const injector = DialogUtils.createInjector(this.injector,[
      {provide: DIALOG_REF, useValue: dialogRef},
      {provide: DIALOG_DATA, useValue: config.data},
    ]);

    if (config.withBackdrop) {
      this.createBackdrop(injector);
    }

    const componentRef: ComponentRef<T> = this.createComponentRef(component, injector)
    const dialogComponentRef: ComponentRef<Dialog> = this.createDialogComponentRef(componentRef, injector);

    dialogRef.onClose$
      .subscribe(() => this.close([componentRef, dialogComponentRef], config));

    return dialogRef;
  }

  /**
   * Creates the component ref reference, ie the component to be injected, ie a Modal, Toast or other type of component to be
   * layered over everything.
   * @param component
   * @param injector
   * @private
   */
  private createComponentRef<T>(component: Type<T>, injector: Injector) {
    const componentRef: ComponentRef<T> = DialogUtils.getComponentRef(component, injector, this.componentFactoryResolver, this.applicationRef);
    DialogUtils.addClass(this.renderer, componentRef.location.nativeElement, 'dialog-component');
    return componentRef;
  }

  /**
   * Crates the Dialog component reference, ie the component that contains the disered type of component.
   * @param componentRef
   * @param injector
   * @private
   */
  private createDialogComponentRef<T>(componentRef: ComponentRef<T>, injector: Injector) {

    const dialogComponentRef = DialogUtils.getComponentRef(Dialog, injector, this.componentFactoryResolver, this.applicationRef, [[componentRef.location.nativeElement]]);

    if (this._attachedComponents.container) {
      this._attachedComponents.container.appendChild(dialogComponentRef.location.nativeElement);
    } else {
      const root: HTMLElement = document.body;
      const container = document.createElement('div');
      DialogUtils.addClass(this.renderer, container, 'dialog-container');
      container.appendChild(dialogComponentRef.location.nativeElement);
      root.appendChild(container);
      this._attachedComponents.container = container;
    }

    this._attachedComponents.dialogs.push(dialogComponentRef);

    return dialogComponentRef;
  }

  /**
   * Creates the backdrop
   * @param injector
   * @private
   */
  private createBackdrop(injector: Injector) {
    let backdropComponentRef: ComponentRef<DialogBackdrop> = DialogUtils.getComponentRef(DialogBackdrop, injector, this.componentFactoryResolver, this.applicationRef);
    const root: HTMLElement = this.document.body;
    root.appendChild(backdropComponentRef.location.nativeElement);
    this._attachedComponents.backdrop = backdropComponentRef;
  }

  /**
   * Removes the backdrop
   * @private
   */
  private removeBackdrop() {
    DialogUtils.detach(this._attachedComponents.backdrop!);
    this._attachedComponents.backdrop = null;
  }

  /**
   * Checks if the dialog type is of type toast, and if there are any other toasts already showing
   * @param type
   * @private
   */
  private checkToasts(type: DialogType) {
    return type === DialogType.Toast &&
      this._attachedComponents.dialogs.some(dialog => dialog.instance.role === DialogType.Toast)
  }

  /**
   * Closes dialogs.
   * This freaky shit checks if there is any dialogs opened.
   * If there is more than one, only close that one that should be closed.
   * Else close everything because there is only one opened.
   * @param refs
   * @param config
   * @private
   */
  private close(refs: ComponentRef<any>[], config: Partial<DialogConfig>): void {

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
