import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from '../../directives';
import {AlertComponent} from './alert.component';
import {IconsModule} from '../../icons.module';
import {InputModule} from '../input';
import {ReactiveFormsModule} from '@angular/forms';
import {ToggleModule} from '../toggle';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    IconsModule,
    InputModule,
    ReactiveFormsModule,
    ToggleModule,
    TranslateModule
  ],
  declarations: [
    AlertComponent
  ]
})
export class AlertModule {}
