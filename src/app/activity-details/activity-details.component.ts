import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.less']
})
export class ActivityDetailsComponent implements OnInit {

  activity: Activity;

  constructor(
    private route: ActivatedRoute,
    private activitiesService: ActivitiesService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.activitiesService.getActivityDetails(id).subscribe((data) => {
      this.activity = data;
    });
  }

}
