import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dependencies'
})
export class DependenciesPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value !== "[]") {
      let arrayString;
      arrayString = value.replace(/"/g,"").replace('[', '').replace(']', '');
      return 'This module requires: ' + arrayString;
    }
    return 'This module has no dependencies.';
  }

}
