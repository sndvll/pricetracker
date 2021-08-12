import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'truncate'})
export class TruncatePipe implements PipeTransform {

  transform(value: string, length = 20): any {
    if (value.length > length) {
      return `${value.substr(0, length)}..`
    }
    return value;
  }

}
