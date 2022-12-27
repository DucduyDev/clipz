import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textEllipsis',
})
export class TextEllipsisPipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (value.length > limit) return value.slice(0, limit) + '...';
    return value;
  }
}
