import { Component, OnInit } from '@angular/core';
import { FAVOURITES } from '../common/consts/local-storage.consts';
import { Activity } from '../common/services/activities/activities.model';
import { ActivitiesService } from '../common/services/activities/activities.service';

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
  ) {}

  ngOnInit(): void {
    this.favouriteIds = JSON.parse(localStorage.getItem(FAVOURITES));
   this.getFavouritesActivities();
  }

  getFavouritesActivities(): void {
    this.favouriteIds?.forEach(id => {
      this.activityService.getActivityDetails(id).subscribe(activity => {
        this.activities.push({...activity, isFavourite: true });
      })
    })
  }
}
