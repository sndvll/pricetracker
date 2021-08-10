import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'change'})
export class AmountChangePipe implements PipeTransform{
  transform(value: string | null): string {
    if (value) {
      return `${Number(value) > 0 ? '+' : ''}${value}%`;
    }
    return '';
  }
}
