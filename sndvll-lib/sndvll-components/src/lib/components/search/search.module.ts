import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconsModule} from '../../icons.module';
import {SearchbarComponent} from './searchbar.component';
import {ButtonModule} from '../../directives';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from './search.component';
import {SearchResultComponent, SearchResultItemComponent} from './search-result.component';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  declarations: [
    SearchbarComponent,
    SearchResultComponent,
    SearchResultItemComponent,
    SearchComponent
  ],
  exports: [
    SearchComponent,
    SearchbarComponent,
    SearchResultItemComponent
  ]
})
export class SearchModule {}
