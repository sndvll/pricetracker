import {Component, Input} from '@angular/core';

@Component({
  selector: 'total-amount',
  template: `
    <div class="p-2">
      <div class="flex text-sm justify-between">
        <span>{{'TOTAL_AMOUNT.HEADER.TOTAL_ASSET_AMOUNT' | translate}}</span>
        <span>24h</span>
      </div>
      <div class="flex justify-between content-center">
        <div class="font-bold"
             [class.text-2xl]="veryLargeAmount"
             [class.text-3xl]="!veryLargeAmount">
          {{totalAmount | currency}}
        </div>
        <div class="self-center text-lg font-bold"
             [class.text-red-500]="negativeChange"
             [class.text-green-500]="!negativeChange">{{(totalAverageMarketChange | number : '1.2-2') | change}}</div>
      </div>
    </div>
  `
})
export class TotalAmountComponent {

  @Input() totalAmount: number = 0;
  @Input() totalAverageMarketChange: number = 0;

  get negativeChange(): boolean {
    return this.totalAverageMarketChange < 0;
  }

  get veryLargeAmount(): boolean {
    return  this.totalAmount > 1000000000;
  }

}
