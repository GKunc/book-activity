import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { catchError, concat, finalize, map, of, switchMap, zipAll } from 'rxjs';
import { ACTIVITY_FILTERS, FAVOURITES } from '../common/consts/local-storage.consts';
import { Activity } from '../common/services/activities/activities.model';
import { ActivitiesService } from '../common/services/activities/activities.service';
import { LocalStorageService } from '../common/services/local-storage/local-storage.service';
import { ResizeService } from '../common/services/resize/resize.service';
import { ActivityFilters, ViewType } from '../shared/activity-filters/activity-filters.model';

@Component({
  selector: 'app-find-activities',
  templateUrl: './find-activities.component.html',
  styleUrls: ['./find-activities.component.less'],
})
export class FindActivitiesComponent implements OnInit, AfterViewInit {
  activities: Activity[] = [];

  lastFilters: ActivityFilters;

  loading: boolean = true;
  noData: boolean = true;
  hasMoreData: boolean = false;
  error: boolean = false;

  viewTypes: typeof ViewType = ViewType;
  openView: ViewType = ViewType.List;
  favouriteIds: string[] = [];

  constructor(
    private activitiesService: ActivitiesService,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    public resizeService: ResizeService
  ) {}

  ngOnInit(): void {
    this.lastFilters = this.localStorageService.getItem<ActivityFilters>(ACTIVITY_FILTERS);
    this.openView = this.lastFilters.viewType;
  }

  ngAfterViewInit(): void {
    this.onSubmitFilters(this.lastFilters);
    this.cdr.detectChanges();
  }

  loadMore(): void {
    this.lastFilters.page = this.lastFilters.page + 1;
    if (this.hasMoreData) {
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
    this.activitiesService
      .filterActivities(filters)
      .pipe(
        switchMap((data) => {
          this.noData = this.hasNoData(data);
          if (data.length === this.lastFilters.limit && data.length !== 0) {
            this.hasMoreData = true;
          } else {
            this.hasMoreData = false;
          }

          if (this.activities.length === 0 && data.length === 0) {
            console.log('NO DATA');

            this.noData = true;
            this.activities = [];
          }

          const requests = data.map((activity: Activity) =>
            this.activitiesService.getPhoto(activity.coverPhoto).pipe(
              map((photo: Blob) => {
                activity.coverPhoto = URL.createObjectURL(photo);
                return activity;
              }),
              catchError((error) => {
                console.error(error);
                return of(activity);
              })
            )
          );

          return concat(requests).pipe(
            zipAll(),
            map((a) => a),
            finalize(() => {
              this.loading = false;
            })
          );
        })
      )
      .subscribe(
        (activities: Activity[]) => {
          console.log('GET ACT', loadMore);

          if (this.localStorageService.getItem<string[]>(FAVOURITES)) {
            this.favouriteIds = this.localStorageService.getItem<string[]>(FAVOURITES);
          }

          if (loadMore) {
            this.activities = [...this.activities, ...activities];
          } else {
            this.activities = [...activities];
          }

          this.activities = this.activities.map((activity) => {
            if (this.favouriteIds?.includes(activity.guid)) {
              return { ...activity, isFavourite: true };
            }
            return { ...activity, isFavourite: false };
          });

          this.cdr.detectChanges();
        },
        (error) => {
          if (error.status !== 403) {
            this.error = true;
            this.loading = false;
          }
        }
      );
  }

  private hasNoData(data: Activity[]): boolean {
    return data.length === 0 && this.activities?.length === 0 ? true : false;
  }
}
