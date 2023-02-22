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
  loading: boolean;

  currentDescription: string;
  descriptionExpanded: boolean = false;
  descriptionTooLong: boolean = false;

  @ViewChild('carouselRef')
  carouselRef: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private activitiesService: ActivitiesService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.activitiesService.getActivityDetails(id).subscribe((data) => {
      this.activity = data;
      if (data.description.length > 150) {
        this.descriptionTooLong = true;
      }
      this.currentDescription = data.description.slice(0, 150);

      for (let i = 0; i < this.activity.nubmerOfImages; i++) {
        this.activitiesService.getPhoto(`${id}-${i}`).subscribe((response) => {
          this.imagesSource.push(URL.createObjectURL(response));
          if (i === this.activity.nubmerOfImages - 1) {
            this.loading = false;
          }
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

  toggleShowMore(): void {
    this.descriptionExpanded = !this.descriptionExpanded;
    if (this.descriptionExpanded) {
      this.currentDescription = this.activity.description;
    } else {
      this.currentDescription = this.activity.description.slice(0, 150);
    }
  }
}
