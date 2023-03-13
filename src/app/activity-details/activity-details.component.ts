import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { environment } from 'src/environments/environment';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';

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
  imagesSource: string[] = [];
  loading: boolean;

  currentDescription: string;
  descriptionExpanded = false;
  descriptionTooLong = false;

  mailToHref: string;
  phoneToHref: string;

  platform: H.service.Platform;

  private map?: H.Map;
  private layers?: H.service.DefaultLayers;

  constructor(
    private route: ActivatedRoute,
    private activitiesService: ActivitiesService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.activitiesService.getActivityDetails(id).subscribe((data) => {
      this.activity = data;
      this.mailToHref = `mailto:${data.email}`;
      this.phoneToHref = `tel:${data.phone}`;
      if (data.description.length > 150) {
        this.descriptionTooLong = true;
      }
      this.currentDescription = data.description.slice(0, 150);
      for (let i = 0; i < this.activity.nubmerOfImages; i++) {
        this.activitiesService.getPhoto(`${id}-${i}`).subscribe((response) => {
          this.imagesSource.push(URL.createObjectURL(response));
          if (i === this.activity.nubmerOfImages - 1) {
            this.loading = false;
            this.createMap();
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

  private createMap(): void {
    this.map = null;
    this.mapDiv.nativeElement.innerHTML = '';

    if (!this.map && this.mapDiv) {
      this.platform = new H.service.Platform({
        'apikey': environment.HERE_MAPS_API_KEY
      });

      this.layers = this.platform.createDefaultLayers();
      this.map = new H.Map(
        this.mapDiv.nativeElement,
        this.layers.vector.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: { lat: this.activity.coordinates.lat, lng: this.activity.coordinates.lng },
          zoom: 13,
        },
      );

      window.addEventListener('resize', () => {
        this.map.getViewPort().resize()
      });

      const fillColor = '#bf0003';
      const backgroundColor = '#ff5050';
      const icon = new H.map.Icon(
        `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path style='stroke:none;fill-rule:nonzero;fill:${backgroundColor};fill-opacity:1' d='M15.98.176c5.305 0 9.622 4.316 9.622 9.62 0 6.755-9.215 13.774-9.622 21.993-.402-8.219-9.617-15.238-9.617-21.992 0-5.305 4.313-9.621 9.617-9.621Zm0 0'/><path style='stroke:none;fill-rule:nonzero;fill:${fillColor};fill-opacity:1' d='M19.219 9.512c0 1.785-1.45 3.23-3.235 3.23a3.233 3.233 0 1 1 0-6.465 3.236 3.236 0 0 1 3.235 3.235Zm0 0'/></svg>`
      );

      const marker = new H.map.Marker({ lat: this.activity.coordinates.lat, lng: this.activity.coordinates.lng }, { icon });
      const group = new H.map.Group();
      this.map.addObject(group);
      group.addObject(marker);
    }
  }
}
