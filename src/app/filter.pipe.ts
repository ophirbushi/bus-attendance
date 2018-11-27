import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(values: string[], searchString: string): string[] {
    if (!values || !searchString) {
      return values;
    }
    return values.filter(s => s.toUpperCase().indexOf(searchString.toUpperCase()) > -1);
  }

}
