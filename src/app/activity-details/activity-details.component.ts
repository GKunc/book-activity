import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { catchError, concat, finalize, map, of, switchMap, zipAll } from 'rxjs';
import { Activity, GroupDetails } from '../common/services/activities/activities.model';
import { ActivitiesService } from '../common/services/activities/activities.service';
import { LoginService } from '../common/services/login-service/login.service';
import { MapService } from '../common/services/map-service/map-service.service';
import { UserService } from '../common/services/user/user.service';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.less'],
})
export class ActivityDetailsComponent implements OnInit {
  @ViewChild('map')
  mapDiv?: ElementRef;

  @ViewChild('mapContainer')
  mapContainer?: ElementRef;

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

  avgRate: number;

  constructor(
    private route: ActivatedRoute,
    private activitiesService: ActivitiesService,
    private mapService: MapService,
    private userService: UserService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.downloadDetails();
  }

  downloadDetails(): void {
    this.loading = true;
    this.error = false;
    const id = this.route.snapshot.paramMap.get('id');

    this.activitiesService
      .getActivityDetails(id)
      .pipe(switchMap((activity: Activity) => this.downloadPhotos(activity)))
      .subscribe(
        (activity: Activity) => {
          this.activity = activity;
          this.mailToHref = `mailto:${activity.email}`;
          this.phoneToHref = `tel:${activity.phone}`;
          if (activity.description.length > 150) {
            this.descriptionTooLong = true;
          }
          this.currentDescription = activity.description.slice(0, 150);
          this.renderMap();
          this.error = false;
          this.loading = false;
        },
        (error) => {
          if (error.status !== 403) {
            this.error = true;
            this.loading = false;
          }
        }
      );
  }

  updateAvgRate(rate: number): void {
    this.avgRate = rate;
  }

  nextImg(): void {
    this.carouselRef.next();
  }

  previousImg(): void {
    this.carouselRef.pre();
  }

  toggleShowMore(): void {
    this.descriptionExpanded = !this.descriptionExpanded;

    if (this.descriptionExpanded) {
      this.currentDescription = this.activity.description;
    } else {
      this.currentDescription = this.activity.description.slice(0, 150);
    }
  }

  signForGroup(group: GroupDetails): void {
    if (this.loginService.loggedUser) {
      this.loading = true;
      this.userService.enrollForGroup(this.loginService.loggedUser, group).subscribe(() => {
        this.loading = false;
      });
    }
  }

  private downloadPhotos(activity: Activity): any {
    const requests = [];
    activity.images?.forEach((image) => {
      requests.push(
        this.activitiesService.getPhoto(image).pipe(
          map((response: Blob) => {
            if (!activity.photos) {
              activity.photos = [];
            }
            activity.photos.push(URL.createObjectURL(response));
            return activity;
          }),
          catchError((error) => {
            console.error(error);
            return of(activity);
          })
        )
      );
    });

    return concat(requests).pipe(
      zipAll(),
      map((a) => a[0]),
      finalize(() => {
        this.loading = false;
        this.error = false;
      })
    );
  }

  private renderMap(): void {
    setTimeout(() => {
      const { map, ui } = this.mapService.loadMap(
        this.mapDiv,
        this.activity.coordinates?.lat,
        this.activity.coordinates?.lng
      );
      this.mapService.addInfoBubble(this.activity, map, ui);
      this.resizeMapToFitScreen();
    });
  }

  private resizeMapToFitScreen(): void {
    if (this.mapDiv) {
      const width = this.mapContainer?.nativeElement.clientWidth + 'px';
      this.mapDiv.nativeElement.style.width = width;
      this.mapDiv.nativeElement.querySelector('canvas').style.width = width;
      this.mapDiv.nativeElement.querySelector('canvas').style.borderRadius = '8px';
    }
  }
}
