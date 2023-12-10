import { WeekDay } from '@angular/common';
import { Category } from 'src/app/common/consts/category.consts';

export interface ActivityFilters {
  phrase: string;
  weekDays: WeekDay[];
  categories: Category[];
  minPrice: number;
  maxPrice: number;
  page: number;
  limit: number;
  viewType: ViewType;
  maxDistance: number;
  coordinates: { lng: number; lat: number };
}

export enum ViewType {
  List,
  Map,
}
