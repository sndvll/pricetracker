import {NgModule} from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {DragContainer, DragItem} from './drag-drop';

@NgModule({
  imports: [
    DragDropModule
  ],
  declarations: [
    DragItem,
    DragContainer
  ],
  exports: [
    DragItem,
    DragContainer,
    DragDropModule
  ]
})
export class DragNDropModule {

}
