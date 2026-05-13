import {ChangeDetectionStrategy, Component, HostBinding, HostListener, Inject} from '@angular/core';
import {OVERLAY_REF, OverlayRef} from '@sndvll/core';
import {ToastConfig, ToastType} from './toast.config';

@Component({
  templateUrl: './toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {

  public config: ToastConfig;
  public icon: string = 'info';
  public timerEnded = false;

  @HostBinding('class') classList = 'toast-component';
  @HostBinding('class.bg-gray-200') info: boolean;
  @HostBinding('class.bg-green-400') success: boolean;
  @HostBinding('class.bg-yellow-400') warning: boolean;
  @HostBinding('class.bg-red-400') error: boolean;

  @HostBinding('class.text-black') textBlack: boolean;
  @HostBinding('class.text-white') textWhite: boolean;

  constructor(@Inject(OVERLAY_REF) private overlayRef: OverlayRef<ToastComponent, ToastConfig>) {
    this.config = overlayRef.config.data!;
    this.info = this.config.type === ToastType.Info;
    this.success = this.config.type === ToastType.Success;
    this.warning = this.config.type === ToastType.Warning;
    this.error = this.config.type === ToastType.Error;
    this.textBlack = this.info || this.warning;
    this.textWhite = this.success || this.error;

    if (this.info || this.success) {
      this.icon = 'info';
    }

    if (this.warning || this.error) {
      this.icon = 'alert-triangle';
    }
  }

  @HostListener('click') click() {
    this.close();
  }

  public close() {
    this.timerEnded = true;
    if (this.overlayRef.config.closable) {
      this.overlayRef.close();
    }
  }

}
