import {Injectable} from '@angular/core';
import {DialogRef, DialogService, DialogType, GlobalDialogConfigBuilder, Opacity} from '../../../core';
import {LoaderComponent} from './loader.component';
import {timer} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoaderService {

  private _dialogRef!: DialogRef<LoaderComponent, never>;

  constructor(private dialog: DialogService) {}

  show(backdrop: boolean, opacity: Opacity): void {
    const config = new GlobalDialogConfigBuilder<LoaderComponent, never>()
      .component(LoaderComponent)
      .type(DialogType.Full)
      .classes('text-red-400')
      .backdropClass('bg-white')
      .isClosable(false)
      .closeOnBackdropClick(false)
      .withBackdrop(backdrop)
      .backdropOpacity(opacity)
      .config;

    if (this._dialogRef) {
      this._dialogRef.close();
    }
    this._dialogRef = this.dialog.open(config);
  }

  dismiss(delay: boolean = true, time: number = 500) {
    if(this._dialogRef) {
      if (delay) {
        timer(time)
          .subscribe(() => {
            this._dialogRef.close();
          });
      } else {
        this._dialogRef.close();
      }

    }
  }

}
