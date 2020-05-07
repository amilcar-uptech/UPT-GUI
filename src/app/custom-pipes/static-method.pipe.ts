import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'staticMethod'
})
// Pipe used to show the label for the normalization method in the main UrbanHotspots dialog
export class StaticMethodPipe implements PipeTransform {

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
