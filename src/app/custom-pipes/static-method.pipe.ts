import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'staticMethod'
})
export class StaticMethodPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let label = value;
    args[0].forEach(element => {
      if (value === element.value) {
        label = element.label;
      }
    });
    return label;
  }

}
