import { Component, Input } from '@angular/core';
import { Activity } from 'src/app/common/services/activities/activities.model';
import { LoginService } from 'src/app/common/services/login-service/login.service';

@Component({
  selector: 'activity-box',
  templateUrl: './activity-box.component.html',
  styleUrls: ['./activity-box.component.less']
})
export class ActivityBoxComponent {
  @Input()
  activity: Activity;

  constructor(
    public loginService: LoginService,
  ) {}

  addToFavourite(): void {
    this.activity = {...this.activity, favourite: true};
    // update user favourites
    // set it to local storage
    // favourites at the top of list
  }
}
