import {Component, Input} from '@angular/core';

@Component({
  selector: 'total-amount',
  template: `
    <card class="bg-white dark:bg-black mb-2 p-2">
      <div class="text-sm justify-between" cardHeader>
        <span>Total asset amount</span>
        <span>24h</span>
      </div>
      <div class="flex justify-between content-center" cardContent>
        <div class="font-bold"
             [class.text-2xl]="veryLargeAmount"
             [class.text-3xl]="!veryLargeAmount">
          {{totalAmount | currency}}
        </div>
        <div class="self-center text-lg font-bold"
             [class.text-red-500]="negativeChange"
             [class.text-green-500]="!negativeChange">{{totalAmountChange | change}}</div>
      </div>
    </card>
  `
})
export class TotalAmountComponent {

  @Input() totalAmount = 0;
  @Input() totalAmountChange = -2.4;

  get negativeChange(): boolean {
    return this.totalAmountChange < 0;
  }

  get veryLargeAmount(): boolean {
    return  this.totalAmount > 1000000000;
  }

}
