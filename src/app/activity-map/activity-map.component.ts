import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ACTIVITY_CATEGORIES, Category } from '../add-activity/category.consts';
import { WeekDay, WEEK_DAYS } from '../add-activity/week-days.consts';
import { ResizeService } from '../common/services/resize/resize.service';

const MAX_PRICE = 1000;

@Component({
  selector: 'app-activity-map',
  templateUrl: './activity-map.component.html',
  styleUrls: ['./activity-map.component.less']
})
export class ActivityMapComponent {
  @ViewChild('map') mapDiv?: ElementRef;

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

  private map?: H.Map;

  constructor(public resizeService: ResizeService) { }

  ngAfterViewInit(): void {
    if (!this.map && this.mapDiv) {
      // instantiate a platform, default layers and a map as usual
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
      const ui = H.ui.UI.createDefault(map, layers);
      const mapEvents = new H.mapevents.MapEvents(map);
      new H.mapevents.Behavior(mapEvents);

      window.addEventListener('resize', () => {
        console.log("resize map");

        map.getViewPort().resize()
      });

      this.map = map;
      this.addInfoBubble(ui);
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

  private addMarkerToGroup(group, coordinate, html) {
    const marker = new H.map.Marker(coordinate);
    // add custom data to the marker
    marker.setData(html);
    group.addObject(marker);
  }


  private addInfoBubble(ui) {
    const group = new H.map.Group();

    this.map.addObject(group);

    // add 'tap' event listener, that opens info bubble, to the group
    group.addEventListener('tap', function (evt) {
      // event target is the marker itself, group is a parent event target
      // for all objects that it contains
      var bubble = new H.ui.InfoBubble((evt.target as any).getGeometry(), {
        // read custom data
        content: (evt.target as any).getData()
      });
      // show info bubble
      ui.addBubble(bubble);
    }, false);

    this.addMarkerToGroup(group, { lat: this.lat, lng: this.lng },
      '<div><a href="https://www.mcfc.co.uk">Manchester City</a></div>' +
      '<div>City of Manchester Stadium<br />Capacity: 55,097</div>');
  }
}
