import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricePLN'
})
export class PricePlnPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value + ' zł';
  }

}
