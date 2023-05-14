import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../consts/category.consts';

@Pipe({
  name: 'category',
})
export class CategoryPipe implements PipeTransform {
  transform(value: Category): unknown {
    switch (value) {
      case Category.Athletics:
        return 'Lekkoateltyka';
      case Category.Swimming:
        return 'Pływanie';
      case Category.Football:
        return 'Piłka nożna';
      case Category.Gymnastics:
        return 'Gimnastyka';
      case Category.GeneralDevelopment:
        return 'Zajęcia ogólnorozwojowe';
      default:
        return '';
    }
  }
}
