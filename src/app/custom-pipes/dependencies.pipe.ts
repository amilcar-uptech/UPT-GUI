import { Pipe, PipeTransform } from '@angular/core';
import { Indicator } from '../interfaces/indicator';

@Pipe({
  name: 'dependencies'
})
export class DependenciesPipe implements PipeTransform {

  transform(value: any, indicators: any[]): any {
    if (value !== "[]") {
      let origString = '';
      let arrayString: string[] = [];
      let newArrayString: string[] = [];
      origString = value.replace(/"/g, '').replace('[', '').replace(']', '');
      arrayString = origString.split(',');
      arrayString.forEach(str => {
        indicators.forEach(ind => {
          if (str.toLowerCase().trim() === ind.value.name.toLowerCase()) {
            newArrayString.push(ind.label);
          }
        });
      });
      return 'This module requires: ' + newArrayString.join(',\n');
    }
    return 'This module has no dependencies.';
  }

}
