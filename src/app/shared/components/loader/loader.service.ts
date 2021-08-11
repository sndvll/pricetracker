import {Injectable} from '@angular/core';
import {DialogRef, DialogService, DialogType, GlobalDialogConfigBuilder, Opacity} from '../../../core';
import {LoaderComponent} from './loader.component';
import {timer} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoaderService {

  private _dialogRef!: DialogRef<LoaderComponent, never>;

  constructor(private dialog: DialogService) {}

  show(backdrop: boolean, opacity: Opacity): void {
    const bgColor = backdrop ? 'bg-white dark:bg-gray-600' : 'bg-transparent'
    const classes = `text-red-400 dark:text-red-200 ${bgColor} opacity-${opacity}`
    const config = new GlobalDialogConfigBuilder<LoaderComponent, never>()
      .component(LoaderComponent)
      .type(DialogType.Full)
      .classes(classes)
      .isClosable(false)
      .withBackdrop(false)
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
