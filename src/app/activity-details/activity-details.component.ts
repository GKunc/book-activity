import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.less']
})
export class ActivityDetailsComponent implements OnInit {

  activity: Activity;
  imagesSource: string[] = [];

  @ViewChild('carouselRef')
  carouselRef: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private activitiesService: ActivitiesService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.activitiesService.getActivityDetails(id).subscribe((data) => {
      this.activity = data;

      for (let i = 0; i < this.activity.nubmerOfImages; i++) {
        this.activitiesService.getPhoto(`${id}-${i}`).subscribe((response) => {
          this.imagesSource.push(URL.createObjectURL(response));
        },
          (e) => console.log("ERROR: ", e),
        )
      }
    });
  }

  nextImg(): void {
    this.carouselRef.next()
  }

  previousImg(): void {
    this.carouselRef.pre()
  }
}
