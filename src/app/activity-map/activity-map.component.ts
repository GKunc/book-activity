import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ACTIVITY_CATEGORIES, Category } from '../add-activity/category.consts';
import { WeekDay, WEEK_DAYS } from '../add-activity/week-days.consts';
import { CategoryPipe } from '../common/pipes/category.pipe';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';
import { ResizeService } from '../common/services/resize/resize.service';

const MAX_PRICE = 1000;
const CATEGORY_COLOR_MAP = new Map<Category, { backgroundColor: string, fillColor: string }>([
  [Category.Athletics, { backgroundColor: '#ff5050', fillColor: '#bf0003' }],
  [Category.Football, { backgroundColor: 'green', fillColor: '#54db54' }],
  [Category.GeneralDevelopment, { backgroundColor: 'darkorange', fillColor: 'orange' }],
  [Category.Gymnastics, { backgroundColor: '#c8c834', fillColor: 'yellow' }],
  [Category.Swimming, { backgroundColor: '#0060ae', fillColor: '#008dff' }],
])

@Component({
  selector: 'app-activity-map',
  templateUrl: './activity-map.component.html',
  styleUrls: ['./activity-map.component.less']
})
export class ActivityMapComponent implements OnInit {
  @ViewChild('map') mapDiv?: ElementRef;

  activities: Activity[];

  minPrice$: Subject<number> = new Subject();
  maxPrice$: Subject<number> = new Subject();

  acitivyCategories: { value: Category, label: string }[] = ACTIVITY_CATEGORIES;
  weekDaysOptions: { value: WeekDay, label: string }[] = WEEK_DAYS;

  phrase: string;
  weekDay: WeekDay[];
  category: Category[];
  minPrice = 0;
  maxPrice: number = MAX_PRICE;
  priceRange: number[] = [0, MAX_PRICE];

  platform: H.service.Platform;
  lat = 50.04;
  lng = 19.94;

  loading = false;

  private map?: H.Map;
  private ui?: H.ui.UI;

  constructor(
    public resizeService: ResizeService,
    private activitiesService: ActivitiesService,
    private categoryPipe: CategoryPipe,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    navigator.geolocation.getCurrentPosition((position) => {
      this.lng = position.coords.longitude;
      this.lat = position.coords.latitude;

      this.loadMap();
      this.loading = false
    });
  }

  loadMap(): void {
    if (!this.map && this.mapDiv) {
      this.platform = new H.service.Platform({
        'apikey': environment.HERE_MAPS_API_KEY
      });

      const layers = this.platform.createDefaultLayers();
      const map = new H.Map(
        this.mapDiv.nativeElement,
        layers.vector.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: { lat: this.lat, lng: this.lng },
          zoom: 13,
        },
      );
      this.ui = H.ui.UI.createDefault(map, layers);
      const mapEvents = new H.mapevents.MapEvents(map);
      new H.mapevents.Behavior(mapEvents);

      window.addEventListener('resize', () => {
        map.getViewPort().resize()
      });

      this.map = map;
      this.getActivities();
    }
  }

  rangePriceChanged(value: number[]): void {
    this.minPrice = value[0];
    this.maxPrice = value[1];
  }

  minPriceChanged(value: number): void {
    this.minPrice$.next(value);
  }


  maxPriceChanged(value: number): void {
    this.maxPrice$.next(value);
  }

  clearAllData(): void {
    this.phrase = undefined;
    this.weekDay = undefined;
    this.category = undefined;
    this.minPrice = 0;
    this.maxPrice = MAX_PRICE;
    this.priceRange = [this.minPrice, this.maxPrice];
  }

  filterActivities(): void {
    return;
  }

  private getActivities(): void {
    this.loading = true;
    this.activitiesService.getActivities().subscribe((data) => {
      this.activities = data;
      this.activities.forEach(activity => {
        this.addInfoBubble(activity);
      })
      this.loading = false;
    });
  }

  private addMarkerToGroup(group, coordinate, html, activity: Activity) {
    let fillColor = '#bf0003';
    let backgroundColor = '#ff5050';
    if (activity.category) {
      fillColor = CATEGORY_COLOR_MAP.get(activity.category).backgroundColor;
      backgroundColor = CATEGORY_COLOR_MAP.get(activity.category).fillColor;
    }
    const icon = new H.map.Icon(
      `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path style='stroke:none;fill-rule:nonzero;fill:${backgroundColor};fill-opacity:1' d='M15.98.176c5.305 0 9.622 4.316 9.622 9.62 0 6.755-9.215 13.774-9.622 21.993-.402-8.219-9.617-15.238-9.617-21.992 0-5.305 4.313-9.621 9.617-9.621Zm0 0'/><path style='stroke:none;fill-rule:nonzero;fill:${fillColor};fill-opacity:1' d='M19.219 9.512c0 1.785-1.45 3.23-3.235 3.23a3.233 3.233 0 1 1 0-6.465 3.236 3.236 0 0 1 3.235 3.235Zm0 0'/></svg>`
    );

    const marker = new H.map.Marker(coordinate, { icon });
    marker.setData(html);
    group.addObject(marker);
  }


  private addInfoBubble(activity: Activity) {
    const group = new H.map.Group();
    this.map.addObject(group);

    group.addEventListener('tap', (evt) => {
      const bubble = new H.ui.InfoBubble({ lat: activity.coordinates.lat, lng: activity.coordinates.lng }, {
        content: (evt.target as any).getData(),
      });
      this.ui.getBubbles().forEach(bub => this.ui.removeBubble(bub));
      this.ui.addBubble(bubble);
      document.getElementById(`details-${activity.guid}`).addEventListener('click', () => {
        this.navigateToDetials(activity);
      })
    }, false);

    if (activity.coordinates) {
      this.addMarkerToGroup(group, { lat: activity.coordinates?.lat, lng: activity.coordinates?.lng },
        `<div style='width: 200px;'><h2 style='margin-bottom: 0;'>${activity.name}</h2></div>` +
        `<div style='color: rgba(0,0,0,.45);'>${this.categoryPipe.transform(activity.category)}</div>` +
        `<div>${activity.street}</div>` +
        `<div id='details-${activity.guid}' (click)='navigateToDetials(${activity})' style='color: purple; cursor: pointer;'>Zobacz</div>`,
        activity
      );
    }
  }

  private navigateToDetials(activity: Activity): void {
    this.router.navigate(['/detail/', activity.guid])
  }
}