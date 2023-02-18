import { WeekDay } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounce, debounceTime, Observable, of, Subject } from 'rxjs';
import { ACTIVITY_CATEGORIES, Category } from '../add-activity/category.consts';
import { WEEK_DAYS } from '../add-activity/week-days.consts';
import { ActivitiesService, Activity, FilterActivitiesParams } from '../common/services/activities/activities.service';

const KEYBOARD_DEBOUND_TIME = 400;

@Component({
  selector: 'app-find-activities',
  templateUrl: './find-activities.component.html',
  styleUrls: ['./find-activities.component.less']
})
export class FindActivitiesComponent implements OnInit {
  activities$: Observable<Activity[]>;
  minPrice$: Subject<number> = new Subject();
  maxPrice$: Subject<number> = new Subject();

  acitivyCategories: { value: Category, label: string }[] = ACTIVITY_CATEGORIES;
  weekDaysOptions: { value: WeekDay, label: string }[] = WEEK_DAYS;

  phrase: string;
  weekDay: WeekDay[] = [];
  category: Category[] = [];
  minPrice: number = 0;
  maxPrice: number = 100;
  priceRange: number[] = [0, 100];

  constructor(private activitiesService: ActivitiesService) { }

  ngOnInit(): void {
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
    const query = this.createFilterQuery();
    this.activities$ = this.activitiesService.filterActivities(query);
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
    this.maxPrice = 100;
    this.priceRange = [this.minPrice, this.maxPrice];
  }

  private getActivities(): void {
    this.activities$ = this.activitiesService.getActivities();
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