import { Component, OnInit } from '@angular/core';
import { catchError, concat, finalize, map, of, switchMap, zipAll } from 'rxjs';
import { FAVOURITES } from '../common/consts/local-storage.consts';
import { Activity } from '../common/services/activities/activities.model';
import { ActivitiesService } from '../common/services/activities/activities.service';
import { LoginService } from '../common/services/login-service/login.service';

@Component({
  selector: 'app-favourites-list',
  templateUrl: './favourites-list.component.html',
  styleUrls: ['./favourites-list.component.less']
})
export class FavouritesListComponent implements OnInit {
  loading: boolean = false;
  error: boolean = false;
  noData: boolean = false;
  favouriteIds: string[] = [];
  activities: Activity[] = [];

  constructor(
    private activityService: ActivitiesService,
    public loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.favouriteIds = JSON.parse(localStorage.getItem(FAVOURITES));
    this.getFavouritesActivities();
  }

  getFavouritesActivities(): void {
    if(this.favouriteIds.length === 0) {
      this.noData = true;
      return
    }

    this.loading = true;
    this.favouriteIds?.forEach(id => {
      this.noData = false;
      this.loading = true;

      this.activityService.getActivityDetails(id).pipe(
        switchMap((activity: Activity) => this.downloadPhotos(activity)),
      ).subscribe(
        (activity: Activity) => {
        this.activities.push({...activity, isFavourite: true });
        this.loading = false;
      },
      () => this.loading = false,
      );
    })
  }

  private downloadPhotos(activity: Activity): any {    
      return this.activityService.getPhoto(activity.coverPhoto)
      .pipe(
        map((photo: Blob) => {
          activity.coverPhoto = URL.createObjectURL(photo)
          return activity;
        }),
        catchError((error) => {
          console.error(error);
          return of(activity);
        })
      );
  }
}
