import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { catchError, concat, finalize, map, of, switchMap, tap, zipAll } from 'rxjs';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';
import { MapService } from '../common/services/map-service/map-service.service';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.less']
})
export class ActivityDetailsComponent implements OnInit {
  @ViewChild('map') mapDiv?: ElementRef;

  @ViewChild('carouselRef')
  carouselRef: NzCarouselComponent;
  activity: Activity;
  loading: boolean;
  error: boolean; 

  currentDescription: string;
  descriptionExpanded = false;
  descriptionTooLong = false;

  mailToHref: string;
  phoneToHref: string;

  constructor(
    private route: ActivatedRoute,
    private activitiesService: ActivitiesService,
    private mapService: MapService,
  ) { }

  ngOnInit(): void {
    this.downloadDetails();
  }

  downloadDetails(): void {
    this.loading = true;
    this.error = false;
    const id = this.route.snapshot.paramMap.get('id');
    this.activitiesService.getActivityDetails(id).pipe(
      switchMap((data) => this.downloadPhotos(id, data)),
    ).subscribe((data: Activity) => {
      this.activity = data;
      this.mailToHref = `mailto:${data.email}`;
      this.phoneToHref = `tel:${data.phone}`;
      if (data.description.length > 150) {
        this.descriptionTooLong = true;
      }
      this.currentDescription = data.description.slice(0, 150);
      this.renderMap();
      this.error = false;
      this.loading = false;
    },
    () => {
      this.error = true;
      this.loading = false;
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

  private downloadPhotos(id: string, activity: Activity): any {
    const requests = [];
    
    for (let i = 0; i < activity.nubmerOfImages; i++) {
      requests.push(this.activitiesService.getPhoto(`${id}-${i}`).pipe(
        map((response: Blob) => {
          if(!activity.photos) {
            activity.photos = [];
          }
          activity.photos.push(URL.createObjectURL(response))
          return activity          
        }),
        catchError((error) => {
          console.error(error);
          return of(activity);
        })
      ))
    }

    return concat(requests).pipe(
      zipAll(),
      map(a => a[0]),
      finalize(() => {
        this.loading = false;
        this.error = false;
      })
    );
  }

  private renderMap(): void {
    setTimeout(() => {
      const { map, ui } = this.mapService.loadMap(this.mapDiv, this.activity.coordinates?.lat, this.activity.coordinates?.lng)
      this.mapService.addInfoBubble(this.activity, map, ui);
    })
  }
}
