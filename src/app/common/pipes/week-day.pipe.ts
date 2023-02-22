import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekDay'
})
export class WeekDayPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    console.log("PIPE", value);
    switch (value) {
      case 0:
        return 'Poniedziałek'
      case 1:
        return 'Wtorek'
      case 2:
        return 'Środa'
      case 3:
        return 'Czwartek'
      case 4:
        return 'Piątek'
      case 5:
        return 'Sobota'
      case 6:
        return 'Niedziela'
      default:
        break;
    }
    return null;
  }

}
