import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { ACTIVITY_CATEGORIES, Category } from 'src/app/add-activity/category.consts';
import { WeekDay, WEEK_DAYS } from 'src/app/add-activity/week-days.consts';
import { ResizeService } from 'src/app/common/services/resize/resize.service';

const KEYBOARD_DEBOUND_TIME = 400;
const MAX_PRICE = 1000;

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
  weekDay: WeekDay[];
  category: Category[];
  minPrice = 0;
  maxPrice: number = MAX_PRICE;
  priceRange: number[] = [0, MAX_PRICE];

  constructor(public resizeService: ResizeService) {}
  
  ngOnInit(): void {
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
    this.weekDay = undefined;
    this.category = undefined;
    this.minPrice = 0;
    this.maxPrice = MAX_PRICE;
    this.priceRange = [this.minPrice, this.maxPrice];
    
    this.showFilters = false;
  }

  submit(): void {
    this.submitFilters.emit({
      phrase: this.phrase,
      weekDays: this.weekDay,
      categories: this.category,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });
    this.showFilters = false;
  }
}

export interface ActivityFilters {
  phrase: string;
  weekDays: WeekDay[];
  categories: Category[];
  minPrice: number;
  maxPrice: number;
}