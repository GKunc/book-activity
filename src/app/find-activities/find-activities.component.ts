import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { catchError, concat, finalize, map, of, switchMap, zipAll } from 'rxjs';
import { FAVOURITES } from '../common/consts/local-storage.consts';
import { Activity } from '../common/services/activities/activities.model';
import { ActivitiesService } from '../common/services/activities/activities.service';
import { ClienntConfigService } from '../common/services/client-config/client-config.service';
import { LocalStorageService } from '../common/services/local-storage/local-storage.service';
import { LoginService } from '../common/services/login-service/login.service';
import { ResizeService } from '../common/services/resize/resize.service';
import { DEFAULT_DISTANCE, MAX_PRICE } from '../shared/activity-filters/activity-filters.component';
import { ActivityFilters, ViewType } from '../shared/activity-filters/activity-filters.model';
import { ActivityFiltersService } from '../shared/activity-filters/activity-filters.service';

@Component({
  selector: 'app-find-activities',
  templateUrl: './find-activities.component.html',
  styleUrls: ['./find-activities.component.less'],
})
export class FindActivitiesComponent implements OnInit {
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
    private configService: ClienntConfigService,
    private loginService: LoginService,
    private activityFiltersService: ActivityFiltersService,
    public resizeService: ResizeService
  ) {}

  // refactor to store
  ngOnInit(): void {
    this.activityFiltersService.getFilters().subscribe((filters) => {
      this.onSubmitFilters(filters, false, true);
    });

    if (this.loginService.loggedUser) {
      this.configService.getUserConfig().subscribe((filters) => {
        this.lastFilters = filters ?? Object.create(null);
        this.openView = this.lastFilters.viewType ?? ViewType.List;
        navigator.geolocation.getCurrentPosition((position) => {
          this.lastFilters.coordinates = { lng: position.coords.longitude, lat: position.coords.latitude };
          this.lastFilters.maxDistance = DEFAULT_DISTANCE;
          this.lastFilters.maxPrice = MAX_PRICE;
          this.onSubmitFilters(this.lastFilters);
          this.cdr.detectChanges();
        });
      });
      return;
    }

    this.onSubmitFilters(this.lastFilters);
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

  onSubmitFilters(filters: Partial<ActivityFilters>, loadMore: boolean = false, clearData: boolean = false): void {
    this.loading = true;
    this.noData = false;
    this.error = false;
    if (clearData) {
      this.activities = [];
    }

    this.activitiesService
      .filterActivities(filters)
      .pipe(
        switchMap((data) => {
          this.noData = this.hasNoData(data);
          if (data.length === this.lastFilters?.limit && data.length !== 0) {
            this.hasMoreData = true;
          } else {
            this.hasMoreData = false;
          }

          if (this.activities.length === 0 && data.length === 0) {
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
