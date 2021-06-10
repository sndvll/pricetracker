import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {AppStore, Asset} from '../../store';
import {DropdownMenuService} from '../../shared/components/dropdown-menu/dropdown-menu.service';
import {DialogRef} from '../../core/dialog';
import {AlertConfig, AlertService, AlertType} from '../../shared/components/alert/alert.service';
import {filter} from 'rxjs/operators';
import {config} from 'rxjs';

@Component({
  selector: 'asset-list',
  templateUrl: './asset-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetListComponent {

  private _dropdownRef!: DialogRef;

  @Input() id!: string;
  @Input() assets!: Asset[];
  @Input() name!: string;

  constructor(private dropdown: DropdownMenuService,
              private alert: AlertService,
              private store: AppStore) {}

  openMenu(origin: HTMLElement, dropdown: TemplateRef<any>) {
    this._dropdownRef = this.dropdown.open(origin, dropdown);
  }

  remove() {
    this.close();
    this.alert
      .open<boolean>({
        type: AlertType.Warning,
        message: 'Do you really want to delete this list?'
      })
      .onClose$
      .pipe(filter(v => v))
      .subscribe(() => this.store.removeList(this.id));
  }

  changeName() {
    this.close();
    this.alert
      .open<string>({
        type: AlertType.Input,
        message: 'Provide a new name',
        data: this.name
      })
      .onClose$
      .pipe(
        filter(v => v)
      )
      .subscribe(name => {
        this.store.editList(name, this.id);
      })
  }

  close() {
    if (this._dropdownRef) {
      this._dropdownRef.close();
    }
  }

}
