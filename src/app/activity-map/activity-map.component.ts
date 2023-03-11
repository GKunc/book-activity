import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ACTIVITY_CATEGORIES, Category } from '../add-activity/category.consts';
import { WeekDay, WEEK_DAYS } from '../add-activity/week-days.consts';
import { CategoryPipe } from '../common/pipes/category.pipe';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';
import { ResizeService } from '../common/services/resize/resize.service';

const MAX_PRICE = 1000;

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
  minPrice: number = 0;
  maxPrice: number = MAX_PRICE;
  priceRange: number[] = [0, MAX_PRICE];

  platform: H.service.Platform;
  lat: number = 50.04;
  lng: number = 19.94;

  loading: boolean = false;

  private map?: H.Map;
  private ui?: H.ui.UI;

  constructor(
    public resizeService: ResizeService,
    private activitiesService: ActivitiesService,
    private categoryPipe: CategoryPipe,
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

  private addMarkerToGroup(group, coordinate, html) {
    const marker = new H.map.Marker(coordinate);
    marker.setData(html);
    group.addObject(marker);
  }


  private addInfoBubble(activity: Activity) {
    const group = new H.map.Group();
    this.map.addObject(group);

    group.addEventListener('tap', (evt) => {
      var bubble = new H.ui.InfoBubble((evt.target as any).getGeometry(), {
        content: (evt.target as any).getData()
      });
      this.ui.addBubble(bubble);
    }, false);

    console.log({ lat: activity.coordinates?.lat, lng: activity.coordinates?.lng });
    if (activity.coordinates) {
      this.addMarkerToGroup(group, { lat: activity.coordinates?.lat, lng: activity.coordinates?.lng },
        `<div style='width: 200px'><h2>${activity.name}</h2></div>` +
        `<div>${this.categoryPipe.transform(activity.category)}</div>` +
        `<div>${activity.street}</div>`
      );
    }
  }
}
