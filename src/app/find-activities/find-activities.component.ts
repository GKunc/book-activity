import { WeekDay } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, concat, finalize, map, of, switchMap, zipAll } from 'rxjs';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';
import { ResizeService } from '../common/services/resize/resize.service';
import { ActivityFilters } from '../shared/activity-filters/activity-filters.component';

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
      this.weekDays = this.route.snapshot.paramMap.get('weekDays')?.split(',').map(item => Number(item));
    }

    this.getActivities();
  }

  onSubmitFilters(filters: ActivityFilters): void {
    this.loading = true;
    this.noData = false;
    this.activitiesService.filterActivities(filters).subscribe(data => {
      this.noData = this.hasNoData(data);
      this.activities = data;
      this.loading = false;
    });
  }

  private getActivities(): void {
    this.loading = true;
    this.noData = false;
      
    this.activitiesService.getActivities().pipe(
      switchMap((data) => {
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
    });
  }

  private hasNoData(data: Activity[]): boolean {
    return data.length === 0 ? true : false;
  }
}
