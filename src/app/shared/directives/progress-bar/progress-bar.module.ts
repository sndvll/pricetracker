import {NgModule} from '@angular/core';
import {ProgressBarDirective} from './progress-bar.directive';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [ProgressBarDirective],
  exports: [ProgressBarDirective]
})
export class ProgressBarModule {}
