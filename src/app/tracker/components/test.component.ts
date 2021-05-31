import {Component, Inject} from '@angular/core';
import {DIALOG_DATA, DIALOG_REF, DialogRef} from '../../core/dialog';

@Component({
  template: `
    <div class="bg-white p-5"><h1>IT WORKS</h1>
      <p>{{testValue}}</p>
      <button (click)="close()">Close</button>
    </div>
  `
})
export class TestComponent {
  public testValue = 'hej';


  constructor(@Inject(DIALOG_DATA) private data: any,
              @Inject(DIALOG_REF) public dialogRef: DialogRef) {
  }

  close() {
    this.dialogRef.close();
  }

}

