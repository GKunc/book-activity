import { Component, Input } from '@angular/core';
import { FAVOURITES } from 'src/app/common/consts/local-storage.consts';
import { Activity } from 'src/app/common/services/activities/activities.model';
import { FavouriteService } from 'src/app/common/services/favourites/favourites.service';
import { LoginService } from 'src/app/common/services/login-service/login.service';

@Component({
  selector: 'activity-box',
  templateUrl: './activity-box.component.html',
  styleUrls: ['./activity-box.component.less'],
})
export class ActivityBoxComponent {
  @Input()
  activity: Activity;

  constructor(public loginService: LoginService, private favouriteService: FavouriteService) {}

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
    let favourites: string[] = JSON.parse(localStorage.getItem(FAVOURITES)) || [];
    if (!favourites?.includes(this.activity.guid) && this.activity.isFavourite) {
      localStorage.setItem(FAVOURITES, JSON.stringify([...favourites, this.activity.guid]));
    } else if (favourites?.includes(this.activity.guid) && !this.activity.isFavourite) {
      favourites = favourites.filter((item) => item !== this.activity.guid);
      localStorage.setItem(FAVOURITES, JSON.stringify([...favourites]));
    }
  }
}
