import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricePLN'
})
export class PricePlnPipe implements PipeTransform {

  transform(value: unknown): unknown {
    return value + ' zł';
  }

}
