import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normMethod'
})
export class NormMethodPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let label = value;
    args[0].forEach(element => {
      if (value === element.value) {
        label = element.label;
      }
    });
    if (isNaN(label)) {
      return label;
    } else {
      return "Select method.";
    }
  }

}
