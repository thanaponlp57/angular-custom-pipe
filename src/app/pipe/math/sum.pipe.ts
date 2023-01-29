import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum',
})
export class SumPipe<T> implements PipeTransform {
  transform(items: T[], key: keyof T): number {   
    if (items === null) return 0;
    return items.reduce((acc, cur) => acc + (cur[key] as number), 0);
  }
}
