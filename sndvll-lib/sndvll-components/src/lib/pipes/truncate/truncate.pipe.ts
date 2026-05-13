import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: false
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, length = 20): any {
    if (value.length > length) {
      return `${value.substring(0, length)}..`
    }
    return value;
  }

}
