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
  imagesSource: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private activitiesService: ActivitiesService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.activitiesService.getActivityDetails(id).subscribe((data) => {
      this.activity = data;
    });

    this.activitiesService.getPhoto(id).subscribe((response) => {
      // const imageElem = document.querySelector('img');
      // imageElem.onload = () => {
      //   URL.revokeObjectURL(imageElem.src);
      // }
      // imageElem.src = URL.createObjectURL(response);
      this.imagesSource.push(URL.createObjectURL(response));
      this.imagesSource.push(URL.createObjectURL(response));
    },
      (e) => console.log("ERROR: ", e),
    )
  }

}
