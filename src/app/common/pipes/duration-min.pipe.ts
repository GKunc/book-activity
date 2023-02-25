import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationMin'
})
export class DurationMinPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value + ' min';
  }

}
