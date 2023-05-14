import { WeekDay } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekDay',
})
export class WeekDayPipe implements PipeTransform {
  transform(value: WeekDay): unknown {
    switch (value) {
      case WeekDay.Monday:
        return 'Poniedziałek';
      case WeekDay.Tuesday:
        return 'Wtorek';
      case WeekDay.Wednesday:
        return 'Środa';
      case WeekDay.Thursday:
        return 'Czwartek';
      case WeekDay.Friday:
        return 'Piątek';
      case WeekDay.Saturday:
        return 'Sobota';
      case WeekDay.Sunday:
        return 'Niedziela';
      default:
        return '';
    }
  }
}
