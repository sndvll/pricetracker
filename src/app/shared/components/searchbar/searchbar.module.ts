import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconsModule} from '../../icons.module';
import {SearchbarComponent} from './searchbar.component';
import {ButtonModule} from '../../directives';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchbarResultComponent, SearchbarResultItemComponent} from './searchbar-result.component';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  declarations: [
    SearchbarComponent,
    SearchbarResultComponent,
    SearchbarResultItemComponent
  ],
  exports: [
    SearchbarComponent,
    SearchbarResultItemComponent
  ]
})
export class SearchbarModule {}
