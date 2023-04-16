import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance } from 'date-fns';
import { pl } from 'date-fns/locale';

@Pipe({
  name: 'dateDistance'
})
export class DateDistancePipe implements PipeTransform {

  transform(value: string | Date): string {
    return formatDistance(new Date(value), new Date(), { locale: pl });
  }
}
