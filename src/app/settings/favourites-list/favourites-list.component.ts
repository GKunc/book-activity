import { Component, OnInit } from '@angular/core';
import { catchError, map, of, tap, switchMap, finalize, zipAll, concat, Observable } from 'rxjs';
import { FAVOURITES } from 'src/app/common/consts/local-storage.consts';
import { Activity } from 'src/app/common/services/activities/activities.model';
import { ActivitiesService } from 'src/app/common/services/activities/activities.service';
import { LocalStorageService } from 'src/app/common/services/local-storage/local-storage.service';
import { LoginService } from 'src/app/common/services/login-service/login.service';

@Component({
  selector: 'app-favourites-list',
  templateUrl: './favourites-list.component.html',
  styleUrls: ['./favourites-list.component.less'],
})
export class FavouritesListComponent implements OnInit {
  loading: boolean = false;
  error: boolean = false;
  noData: boolean = false;
  favouriteIds: string[] = [];
  activities: Activity[] = [];

  constructor(
    private activityService: ActivitiesService,
    private localStorageService: LocalStorageService,
    public loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.noData = false;
    if (this.localStorageService.getItem<string[]>(FAVOURITES)) {
      this.favouriteIds = this.localStorageService
        .getItem<string[]>(FAVOURITES)
        .filter((item) => item !== null && item !== undefined);
    }
    this.getFavouritesActivities();

    this.loginService._favourites$.subscribe((favourites) => {
      this.favouriteIds = favourites.filter((item) => item !== null && item !== undefined);
      this.getFavouritesActivities();
    });
  }

  getFavouritesActivities(): void {
    this.activities = [];
    if (!this.favouriteIds || this.favouriteIds?.length === 0) {
      this.noData = true;
      return;
    }

    this.loading = true;
    const requests = this.favouriteIds?.map((id) => {
      return this.activityService
        .getActivityDetails(id)
        .pipe(switchMap((activity: Activity) => this.downloadPhotos(activity)));
    });

    concat(requests)
      .pipe(
        zipAll(),
        tap((activities: Activity[]) => {
          return activities.map((activity) => ({
            ...activity,
            isFavourite: true,
          }));
        }),
        catchError(() => {
          return of(this.activities);
        }),

        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((activities) => {
        this.activities = activities.filter((a) => a !== null).map((activity) => ({ ...activity, isFavourite: true }));
      });
  }

  private downloadPhotos(activity: Activity): Observable<Activity> {
    if (activity?.coverPhoto) {
      return this.activityService.getPhoto(activity.coverPhoto).pipe(
        map((photo: Blob) => {
          activity.coverPhoto = URL.createObjectURL(photo);
          return activity;
        }),
        catchError((error) => {
          console.error(error);
          return of(activity);
        })
      );
    } else {
      return of(activity);
    }
  }
}
