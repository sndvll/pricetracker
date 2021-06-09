import {Injectable, TemplateRef} from '@angular/core';
import {ConnectedDialogConfigBuilder, DialogConnectedPosition, DialogService} from '../../../core/dialog';
import {DropdownMenuComponent} from './dropdown-menu.component';

@Injectable({providedIn: 'root'})
export class DropdownMenuService {

  constructor(private dialog: DialogService) {}

  public open(origin: HTMLElement, templateRef: TemplateRef<any>) {
    const dialogConfig = DropdownMenuService.getDialogConfig(origin, templateRef);
    return this.dialog.open(dialogConfig);
  }

  private static getDialogConfig(origin: HTMLElement, templateRef: TemplateRef<any>) {
    return new ConnectedDialogConfigBuilder<DropdownMenuComponent, TemplateRef<any>>()
      .origin(origin)
      .data(templateRef)
      .component(DropdownMenuComponent)
      .preferredConnectedPosition(DialogConnectedPosition.BottomRight)
      .config;
  }

}
