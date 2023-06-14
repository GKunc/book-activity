import { Component, Input } from '@angular/core';
import { FAVOURITES } from 'src/app/common/consts/local-storage.consts';
import { Activity } from 'src/app/common/services/activities/activities.model';
import { FavouriteService } from 'src/app/common/services/favourites/favourites.service';
import { LocalStorageService } from 'src/app/common/services/local-storage/local-storage.service';
import { LoginService } from 'src/app/common/services/login-service/login.service';

@Component({
  selector: 'activity-box',
  templateUrl: './activity-box.component.html',
  styleUrls: ['./activity-box.component.less'],
})
export class ActivityBoxComponent {
  @Input()
  activity: Activity;

  constructor(
    public loginService: LoginService,
    private favouriteService: FavouriteService,
    private localStorageService: LocalStorageService
  ) {}

  addToFavourite(): void {
    this.activity = { ...this.activity, isFavourite: !this.activity.isFavourite };
    console.log(this.activity);

    this.favouriteService
      .updateFavourites({
        userId: this.loginService.loggedUser.id,
        favourites: [this.activity.guid],
        isNew: this.activity.isFavourite,
      })
      .subscribe();
    let favourites: string[] = this.localStorageService.getItem<string[]>(FAVOURITES) || [];
    if (!favourites?.includes(this.activity.guid) && this.activity.isFavourite) {
      if (this.activity.guid) {
        this.localStorageService.setItem(FAVOURITES, [...favourites, this.activity.guid]);
      }
    } else if (favourites?.includes(this.activity.guid) && !this.activity.isFavourite) {
      favourites = favourites.filter((item) => item !== this.activity.guid);
      this.localStorageService.setItem(FAVOURITES, [...favourites]);
    }
  }
}
