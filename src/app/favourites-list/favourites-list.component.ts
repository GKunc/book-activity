import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, map, of, tap, switchMap, finalize } from 'rxjs';
import { FAVOURITES } from '../common/consts/local-storage.consts';
import { Activity } from '../common/services/activities/activities.model';
import { ActivitiesService } from '../common/services/activities/activities.service';
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

  constructor(private activityService: ActivitiesService, public loginService: LoginService) {}

  ngOnInit(): void {
    this.noData = false;
    if (localStorage.getItem(FAVOURITES) && localStorage.getItem(FAVOURITES) !== 'undefined') {
      this.favouriteIds = JSON.parse(localStorage.getItem(FAVOURITES));
    }
    this.getFavouritesActivities();

    this.loginService._favourites$.subscribe((favourites) => {
      this.favouriteIds = favourites.filter((item) => !!item);
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

    forkJoin(requests)
      .pipe(
        tap((activities: Activity[]) => {
          return activities.map((activity) => ({
            ...activity,
            isFavourite: true,
          }));
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((activities) => {
        this.activities = activities;
        this.activities.forEach((activity) => (activity.isFavourite = true));
      });
  }

  private downloadPhotos(activity: Activity): any {
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
  }
}
