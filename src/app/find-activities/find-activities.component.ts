import { AfterViewInit, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { catchError, concat, finalize, map, of, switchMap, zipAll } from 'rxjs';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';
import { ResizeService } from '../common/services/resize/resize.service';
import { ActivityFilters, ACTIVITY_FILTERS, ViewType } from '../shared/activity-filters/activity-filters.component';

@Component({
  selector: 'app-find-activities',
  templateUrl: './find-activities.component.html',
  styleUrls: ['./find-activities.component.less']
})
export class FindActivitiesComponent implements AfterViewInit {
  activities: Activity[] = [];

  lastFilters: ActivityFilters;

  loading: boolean = true;
  noData: boolean = true;
  hasMoreData: boolean = false;
  error: boolean = false;

  viewTypes: typeof ViewType = ViewType;
  openView: ViewType = ViewType.List;

  constructor(
    private activitiesService: ActivitiesService,
    private cdr: ChangeDetectorRef,
    public resizeService: ResizeService,
  ) { }

  ngAfterViewInit(): void {
    this.lastFilters = JSON.parse(localStorage.getItem(ACTIVITY_FILTERS));
    this.openView = this.lastFilters.viewType;
    this.onSubmitFilters(this.lastFilters);
    this.cdr.detectChanges();
  }

  loadMore(): void {
    if(this.hasMoreData) {
      this.lastFilters.page = this.lastFilters.page + 1;
      this.onSubmitFilters(this.lastFilters, true);
    }
  }

  changeView(viewType: ViewType): void {
    this.openView = viewType;
  }

  onSubmitFilters(filters: Partial<ActivityFilters>, loadMore: boolean = false): void {
    this.loading = true;
    this.noData = false;
    this.error = false;
    this.activitiesService.filterActivities(filters).pipe(
      // switchMap((data) => {
      //   this.noData = this.hasNoData(data);
      //   const requests = data.map((activity: Activity) => 
      //     this.activitiesService.getPhoto(activity.images[0]).pipe(
      //       map((photo: Blob) => {
      //         activity.coverPhoto = URL.createObjectURL(photo)
      //         return activity;
      //       }),
      //       catchError((error) => {
      //         console.error(error);
      //         return of(activity);
      //       })
      //     ),
      //   )
        
      //   return concat(requests).pipe(
      //       zipAll(),
      //       map((a) => a),
      //       finalize(() => {
      //         this.loading = false;
      //       })
      //     );
      // })
    ).subscribe((activities: Activity[]) => {
      this.loading = false; // to delete
      if(activities.length === this.lastFilters.limit) {
        this.hasMoreData = true;
      } else {
        this.hasMoreData = false;
      }
      if(loadMore) {
        this.activities = [...this.activities, ...activities];
      } else {
        this.activities = activities;
      }
    },
    (error) => {
      if (
        error.status !== 403
      ) {
        this.error = true;
        this.loading = false;
      }
    });
  }

  private hasNoData(data: Activity[]): boolean {
    return data.length === 0 ? true : false;
  }
}
