import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {CryptoSearchbarComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    CryptoSearchbarComponent
  ],
  exports: [
    CryptoSearchbarComponent
  ]
})
export class CryptoSearchbarModule {}
