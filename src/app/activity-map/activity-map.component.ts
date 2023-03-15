import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ACTIVITY_CATEGORIES, Category } from '../add-activity/category.consts';
import { WeekDay, WEEK_DAYS } from '../add-activity/week-days.consts';
import { ActivitiesService, Activity, FilterActivitiesParams } from '../common/services/activities/activities.service';
import { MapService } from '../common/services/map-service/map-service.service';
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
  minPrice = 0;
  maxPrice: number = MAX_PRICE;
  priceRange: number[] = [0, MAX_PRICE];

  lat = 50.04;
  lng = 19.94;

  loading = false;
  noData = true;

  private map?: H.Map;
  private ui?: H.ui.UI;
  private platform?: H.service.Platform;
   
  constructor(
    public resizeService: ResizeService,
    private activitiesService: ActivitiesService,
    private mapService: MapService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    navigator.geolocation.getCurrentPosition((position) => {
      this.lng = position.coords.longitude;
      this.lat = position.coords.latitude;
      const { map, ui, platform } = this.mapService.loadMap(this.mapDiv, this.lat, this.lng);
      this.map = map;
      this.ui = ui;
      this.platform = platform;

      this.getActivities();
      this.loading = false
    });
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
      const { map, ui, platform } = this.mapService.loadMap(this.mapDiv, this.lat, this.lng);
      this.map = map;
      this.ui = ui;
      this.platform = platform;
  }

  private getActivities(): void {
    this.loading = true;
    this.noData = false;
    const query = this.createFilterQuery();
    this.activitiesService.filterActivities(query).subscribe(data => {
      this.noData = this.hasNoData(data);
      this.activities = data;
      this.activities.forEach(activity => {
        this.mapService.addInfoBubble(activity, this.map, this.ui); 
      })
      this.loading = false;
    });
  }

  private createFilterQuery(): Partial<FilterActivitiesParams> {
    const query = {}
    query['phrase'] = this.phrase ?? this.phrase
    query['weekDay'] = this.weekDay ?? this.weekDay
    query['category'] = this.category ?? this.category
    query['minPrice'] = this.minPrice ?? this.minPrice
    query['maxPrice'] = this.maxPrice ?? this.maxPrice

    return query;
  }

  private hasNoData(data: Activity[]): boolean {
    return data.length === 0 ? true : false;
  }
}