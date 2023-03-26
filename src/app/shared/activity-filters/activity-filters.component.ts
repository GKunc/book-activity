import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { ACTIVITY_CATEGORIES, Category } from 'src/app/add-activity/category.consts';
import { WeekDay, WEEK_DAYS } from 'src/app/add-activity/week-days.consts';
import { ResizeService } from 'src/app/common/services/resize/resize.service';

const KEYBOARD_DEBOUND_TIME = 400;
const MAX_PRICE = 1000;
export const ACTIVITY_FILTERS = 'activity_filters';

@Component({
  selector: 'activity-filters',
  templateUrl: './activity-filters.component.html',
  styleUrls: ['./activity-filters.component.less']
})
export class ActivityFiltersComponent implements OnInit {
  @Output()
  submitFilters: EventEmitter<ActivityFilters> = new EventEmitter<ActivityFilters>();

  showFilters: boolean = false;
  minPrice$: Subject<number> = new Subject();
  maxPrice$: Subject<number> = new Subject();

  acitivyCategories: { value: Category, label: string }[] = ACTIVITY_CATEGORIES;
  weekDaysOptions: { value: WeekDay, label: string }[] = WEEK_DAYS;

  phrase: string;
  weekDays: WeekDay[];
  categories: Category[];
  minPrice = 0;
  maxPrice: number = MAX_PRICE;
  priceRange: number[] = [0, MAX_PRICE];

  constructor(public resizeService: ResizeService) {}
  
  ngOnInit(): void {
    const filters = JSON.parse(localStorage.getItem(ACTIVITY_FILTERS));
    if(filters) {
      console.log("FILTEr", filters);
      
      this.phrase = filters.phrase;
      this.weekDays = filters.weekDays;
      this.categories = filters.categories;
      this.minPrice = filters.minPrice;
      this.maxPrice = filters.maxPrice;
      this.priceRange = [this.minPrice, this.maxPrice];
    }

    this.minPrice$.pipe(
      debounceTime(KEYBOARD_DEBOUND_TIME)
    ).subscribe(price => {
      this.priceRange = [price, this.maxPrice]
    })

    this.maxPrice$.pipe(
      debounceTime(KEYBOARD_DEBOUND_TIME)
    ).subscribe(price => {
      this.priceRange = [this.minPrice, price]
    })
  }

  openFilters(): void {
    this.showFilters = true;
  }

  rangePriceChanged(value: number[]): void {
    this.minPrice = value[0];
    this.maxPrice = value[1];
  }

  minPriceChanged(value: number): void {
    this.minPrice$.next(value);
  }


  maxPriceChanged(value: number): void {
    this.maxPrice$.next(value);
  }

  clearAllFilters(): void {
    this.phrase = undefined;
    this.weekDays = undefined;
    this.categories = undefined;
    this.minPrice = 0;
    this.maxPrice = MAX_PRICE;
    this.priceRange = [this.minPrice, this.maxPrice];
    
    this.showFilters = false;
    localStorage.setItem(ACTIVITY_FILTERS, null);
  }

  submit(): void {
    const filters = {
      phrase: this.phrase,
      weekDays: this.weekDays,
      categories: this.categories,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    };

    this.submitFilters.emit(filters);
    this.showFilters = false;
    localStorage.setItem(ACTIVITY_FILTERS, JSON.stringify(filters))
  }
}

export interface ActivityFilters {
  phrase: string;
  weekDays: WeekDay[];
  categories: Category[];
  minPrice: number;
  maxPrice: number;
}