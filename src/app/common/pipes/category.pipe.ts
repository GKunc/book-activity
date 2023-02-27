import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 0:
        return 'Lekkoateltyka'
      case 1:
        return 'Pływanie'
      case 2:
        return 'Piłka nożna'
      case 3:
        return 'Gimnastyka'
      case 4:
        return 'Zajęcia ogólnorozwojowe'
      default:
        throw new Error('Brak podanej kategorii zajęć!')
    }
  }
}
