import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'change'})
export class AmountChangePipe implements PipeTransform{
  transform(value: number): string {
    return `${value > 0 ? '+' : ''}${value}%`;
  }
}
