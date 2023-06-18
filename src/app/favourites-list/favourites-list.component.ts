import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, map, of, tap, switchMap, finalize, filter, zipAll, concat } from 'rxjs';
import { FAVOURITES } from '../common/consts/local-storage.consts';
import { Activity } from '../common/services/activities/activities.model';
import { ActivitiesService } from '../common/services/activities/activities.service';
import { LocalStorageService } from '../common/services/local-storage/local-storage.service';
import { LoginService } from '../common/services/login-service/login.service';

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
        catchError((e) => {
          return of(this.activities);
        }),

        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((activities) => {
        this.activities = activities.filter((a) => a !== null);
      });
  }

  private downloadPhotos(activity: Activity): any {
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
