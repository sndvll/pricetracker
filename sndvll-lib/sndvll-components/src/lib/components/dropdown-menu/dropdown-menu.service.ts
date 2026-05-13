import {Injectable, TemplateRef} from '@angular/core';
import {
  ConnectedOverlayConfigBuilder,
  Opacity,
  OverlayConfig,
  OverlayConnectedPosition,
  OverlayService
} from '@sndvll/core';
import {DropdownMenuComponent} from './dropdown-menu.component';

@Injectable({providedIn: 'root'})
export class DropdownMenuService {

  constructor(private overlay: OverlayService) {}

  public open(origin: HTMLElement,
              templateRef: TemplateRef<any>,
              position: OverlayConnectedPosition = OverlayConnectedPosition.BottomRight,
              opacity: Opacity = '30',
              backdropClass = 'bg-white dark:bg-black') {
    const overlayConfig = DropdownMenuService.getDropdownConfig(origin, templateRef, position, opacity, backdropClass);
    return this.overlay.open(overlayConfig);
  }


  public static getDropdownConfig(origin: HTMLElement,
                                  templateRef: TemplateRef<any>,
                                  position: OverlayConnectedPosition,
                                  opacity: Opacity,
                                  backdropClass: string) {
    return new ConnectedOverlayConfigBuilder<DropdownMenuComponent, TemplateRef<any>>()
      .origin(origin)
      .data(templateRef)
      .component(DropdownMenuComponent)
      .backdropClass(backdropClass)
      .backdropOpacity(opacity)
      .preferredConnectedPosition(position)
      .config;
  }

}
