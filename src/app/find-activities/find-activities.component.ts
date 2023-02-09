import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';

@Component({
  selector: 'app-find-activities',
  templateUrl: './find-activities.component.html',
  styleUrls: ['./find-activities.component.less']
})
export class FindActivitiesComponent implements OnInit {
  activities$: Observable<Activity[]>;

  constructor(private activitiesService: ActivitiesService) { }

  ngOnInit(): void {
    this.getActivities();
  }
  getActivities(): void {
    this.activities$ = this.activitiesService.getActivities();
  }

}
