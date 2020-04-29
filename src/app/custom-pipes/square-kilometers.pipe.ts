import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'squareKilometers'
})
// Pipe used to show km2 as ㎢
export class SquareKilometersPipe implements PipeTransform {

  transform(s: string): string {
    if (s.includes('km2')) {
      return s.replace('km2', '㎢');
    }
  }

}
