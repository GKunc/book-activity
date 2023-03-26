import { WeekDay } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, concat, finalize, map, of, switchMap, zipAll } from 'rxjs';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';
import { ResizeService } from '../common/services/resize/resize.service';
import { ActivityFilters, ACTIVITY_FILTERS } from '../shared/activity-filters/activity-filters.component';

@Component({
  selector: 'app-find-activities',
  templateUrl: './find-activities.component.html',
  styleUrls: ['./find-activities.component.less']
})
export class FindActivitiesComponent implements OnInit {
  activities: Activity[];

  phrase: string;
  weekDays: WeekDay[];

  loading: boolean;
  noData: boolean = true;
  error: boolean = false;

  constructor(
    private activitiesService: ActivitiesService,
    public resizeService: ResizeService,
  ) { }

  ngOnInit(): void {
    this.onSubmitFilters(JSON.parse(localStorage.getItem(ACTIVITY_FILTERS)));
  }

  onSubmitFilters(filters: Partial<ActivityFilters>): void {
    this.loading = true;
    this.noData = false;
    this.error = false;
    this.activitiesService.filterActivities(filters).pipe(
      switchMap((data) => {
        this.noData = this.hasNoData(data);

        const requests = data.map((activity) => 
          this.activitiesService.getPhoto(`${activity.guid}-0`).pipe(
            map((photo: Blob) => {
              activity.coverPhoto = URL.createObjectURL(photo)
              return activity;
            }),
            catchError((error) => {
              console.error(error);
              return of(activity);
            })
          ),
        )
        
        return concat(requests).pipe(
            zipAll(),
            map((a) => a),
            finalize(() => {
              this.loading = false;
            })
          );
      })
    ).subscribe((activities: Activity[]) => {
      this.activities = activities;
    },
    () => {
      this.error = true;
      this.loading = false;
    });
  }

  private hasNoData(data: Activity[]): boolean {
    return data.length === 0 ? true : false;
  }
}
