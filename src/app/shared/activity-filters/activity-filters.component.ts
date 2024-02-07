import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { Category } from 'src/app/common/consts/category.consts';
import { ACTIVITY_FILTERS } from 'src/app/common/consts/local-storage.consts';
import { WeekDay, WEEK_DAYS } from 'src/app/common/consts/week-days.consts';
import { ClienntConfigService } from 'src/app/common/services/client-config/client-config.service';
import { DictionaryService } from 'src/app/common/services/dictionary/dictionary.service';
import { LocalStorageService } from 'src/app/common/services/local-storage/local-storage.service';
import { ResizeService } from 'src/app/common/services/resize/resize.service';
import { ActivityFilters, ViewType } from './activity-filters.model';

const KEYBOARD_DEBOUND_TIME = 400;
export const MAX_PRICE = 200;
export const DEFAULT_DISTANCE = 50;

@Component({
  selector: 'activity-filters',
  templateUrl: './activity-filters.component.html',
  styleUrls: ['./activity-filters.component.less'],
})
export class ActivityFiltersComponent implements OnInit {
  @Output()
  submitFilters: EventEmitter<ActivityFilters> = new EventEmitter<ActivityFilters>();

  @Output()
  submitView: EventEmitter<ViewType> = new EventEmitter<ViewType>();

  showFilters: boolean = false;
  minPrice$: Subject<number> = new Subject();
  maxPrice$: Subject<number> = new Subject();

  acitivyCategories: { value: Category; label: string }[];
  weekDaysOptions: { value: WeekDay; label: string }[] = WEEK_DAYS;

  phrase: string;
  weekDays: WeekDay[];
  categories: Category[];
  minPrice = 0;
  maxPrice: number = MAX_PRICE;
  priceRange: number[] = [0, MAX_PRICE];
  maxDistance: number = DEFAULT_DISTANCE;
  page: number;
  limit: number;
  viewType: ViewType;
  coordinates: { lng: number; lat: number };

  options = [
    { label: 'Lista', value: ViewType.List, icon: 'bars' },
    { label: 'Mapa', value: ViewType.Map, icon: 'environment' },
  ];

  constructor(
    private dictionaryService: DictionaryService,
    private localStorageService: LocalStorageService,
    private configService: ClienntConfigService,
    public resizeService: ResizeService
  ) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.coordinates = { lng: position.coords.longitude, lat: position.coords.latitude };

      this.dictionaryService.getDictionary('categories').subscribe((categories) => {
        this.acitivyCategories = categories;
      });

      const filters = this.localStorageService.getItem<ActivityFilters>(ACTIVITY_FILTERS);
      if (filters) {
        this.phrase = filters.phrase;
        this.weekDays = filters.weekDays;
        this.categories = filters.categories;
        this.minPrice = filters.minPrice;
        this.maxPrice = filters.maxPrice;
        this.priceRange = [this.minPrice, this.maxPrice];
        this.page = 1;
        this.limit = 10;
        this.viewType = filters.viewType;
        this.maxDistance = filters.maxDistance || DEFAULT_DISTANCE;
        this.coordinates = filters.coordinates;
      } else {
        this.clearAllFilters();
      }

      this.minPrice$.pipe(debounceTime(KEYBOARD_DEBOUND_TIME)).subscribe((price) => {
        this.priceRange = [price, this.maxPrice];
      });

      this.maxPrice$.pipe(debounceTime(KEYBOARD_DEBOUND_TIME)).subscribe((price) => {
        this.priceRange = [this.minPrice, price];
      });
    });
  }

  onSetCategory(category: Category): void {
    this.categories = [category];
    this.submit();
  }

  changeView(value: number): void {
    if (value === 0) {
      this.viewType = ViewType.List;
    } else {
      this.viewType = ViewType.Map;
    }
    this.submitView.emit(this.viewType);
    const filters = this.createFilters();
    this.localStorageService.setItem(ACTIVITY_FILTERS, filters);
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

  distanceChanged(distance: number): void {
    this.maxDistance = distance;
  }

  clearAllFilters(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.phrase = null;
      this.weekDays = null;
      this.minPrice = 0;
      this.maxPrice = MAX_PRICE;
      this.priceRange = [this.minPrice, this.maxPrice];
      this.page = 1;
      this.limit = 10;
      this.maxDistance = DEFAULT_DISTANCE;
      this.showFilters = false;
      this.coordinates = { lng: position.coords.longitude, lat: position.coords.latitude };
    });

    const filters = this.createFilters();
    this.localStorageService.setItem(ACTIVITY_FILTERS, filters);
  }

  submit(): void {
    const filters = this.createFilters();
    this.submitFilters.emit(filters);
    this.showFilters = false;
    this.configService.setConfig(filters).subscribe();
  }

  private createFilters(): ActivityFilters {
    return {
      phrase: this.phrase,
      weekDays: this.weekDays,
      categories: this.categories,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      page: this.page,
      limit: this.limit,
      viewType: this.viewType,
      maxDistance: this.maxDistance,
      coordinates: this.coordinates,
    };
  }
}
