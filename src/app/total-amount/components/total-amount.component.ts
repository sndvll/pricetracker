import {Component, Input} from '@angular/core';

@Component({
  selector: 'total-amount',
  templateUrl: './total-amount.component.html'
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
