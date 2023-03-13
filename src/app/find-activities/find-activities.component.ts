import { WeekDay } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, Observable, Subject } from 'rxjs';
import { ACTIVITY_CATEGORIES, Category } from '../add-activity/category.consts';
import { WEEK_DAYS } from '../add-activity/week-days.consts';
import { ActivitiesService, Activity, FilterActivitiesParams } from '../common/services/activities/activities.service';
import { ResizeService } from '../common/services/resize/resize.service';

const KEYBOARD_DEBOUND_TIME = 400;
const MAX_PRICE = 1000;

@Component({
  selector: 'app-find-activities',
  templateUrl: './find-activities.component.html',
  styleUrls: ['./find-activities.component.less']
})
export class FindActivitiesComponent implements OnInit {
  activities: Activity[];
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

  loading: boolean;
  noData:boolean = true;

  constructor(
    private activitiesService: ActivitiesService,
    private route: ActivatedRoute,
    public resizeService: ResizeService,
  ) { }

  ngOnInit(): void {
    this.phrase = this.route.snapshot.paramMap.get('phrase');
    const includesWeekDays = this.route.snapshot.paramMap.get('weekDays')?.includes(',');
    if (includesWeekDays) {
      this.weekDay = this.route.snapshot.paramMap.get('weekDays')?.split(',').map(item => Number(item));
    }

    this.getActivities();

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

  filterActivities(): void {
    this.loading = true;
    this.noData = false;
    const query = this.createFilterQuery();
    this.activitiesService.filterActivities(query).subscribe(data => {
      this.noData = this.hasNoData(data);
      this.activities = data;
      this.loading = false;
    });
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

  clearAllData(): void {
    this.phrase = undefined;
    this.weekDay = undefined;
    this.category = undefined;
    this.minPrice = 0;
    this.maxPrice = MAX_PRICE;
    this.priceRange = [this.minPrice, this.maxPrice];
  }

  private getActivities(): void {
    this.loading = true;
    this.noData = false;
    this.activitiesService.getActivities().subscribe((data) => {
      this.noData = this.hasNoData(data);
      this.activities = data;
      this.activities.forEach(activity => {
        // zrownoleglic
        this.activitiesService.getPhoto(`${activity.guid}-0`).subscribe(response =>
          activity.coverPhoto = URL.createObjectURL(response)
        )
      })
      this.loading = false;
    });
  }

  private hasNoData(data: Activity[]): boolean {
    return data.length === 0 ? true : false;
  }

  private createFilterQuery(): Partial<FilterActivitiesParams> {
    const query = {}
    query['phrase'] = this.phrase ?? this.phrase
    query['weekDay'] = this.weekDay ?? this.weekDay
    query['category'] = this.category ?? this.category
    query['minPrice'] = this.minPrice ?? this.minPrice
    query['maxPrice'] = this.maxPrice ?? this.maxPrice

    return query;
  }
}
