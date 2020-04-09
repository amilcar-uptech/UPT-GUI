import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'squareKilometers'
})
export class SquareKilometersPipe implements PipeTransform {

  transform(s: string): string {
    if (s.match('km2')) {
      return s.replace('km2', '㎢');
    }
  }

}
