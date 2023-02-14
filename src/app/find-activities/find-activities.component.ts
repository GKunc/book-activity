import { WeekDay } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ACTIVITY_CATEGORIES, Category } from '../add-activity/category.consts';
import { WEEK_DAYS } from '../add-activity/week-days.consts';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';

@Component({
  selector: 'app-find-activities',
  templateUrl: './find-activities.component.html',
  styleUrls: ['./find-activities.component.less']
})
export class FindActivitiesComponent implements OnInit {
  activities$: Observable<Activity[]>;
  acitivyCategories: { value: Category, label: string }[] = ACTIVITY_CATEGORIES;
  weekDaysOptions: { value: WeekDay, label: string }[] = WEEK_DAYS;

  minPrice: number = 0;
  maxPrice: number = 100;
  priceRange: number[] = [0, 100];

  constructor(private activitiesService: ActivitiesService) { }

  ngOnInit(): void {
    this.getActivities();
  }

  filterActivities(): void {
    this.activitiesService.filterActivities().subscribe();
  }

  private getActivities(): void {
    this.activities$ = this.activitiesService.getActivities();
  }

}
