import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivitiesService, Activity, FilterActivitiesParams } from '../common/services/activities/activities.service';
import { MapService } from '../common/services/map-service/map-service.service';
import { ResizeService } from '../common/services/resize/resize.service';
import { ActivityFilters } from '../shared/activity-filters/activity-filters.component';


@Component({
  selector: 'app-activity-map',
  templateUrl: './activity-map.component.html',
  styleUrls: ['./activity-map.component.less']
})
export class ActivityMapComponent implements OnInit {
  @ViewChild('map') mapDiv?: ElementRef;

  activities: Activity[];

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

      this.onSubmitFilters({minPrice: 0, maxPrice: 1000});
      this.loading = false
    });
  }

  onSubmitFilters(filters: Partial<ActivityFilters>): void {
    this.loading = true;
    this.noData = false;
    const query = this.createFilterQuery(filters);
    this.activitiesService.filterActivities(query).subscribe(data => {
      
      this.noData = this.hasNoData(data);
      this.activities = data;
      this.activities.forEach(activity => {
      console.log("activity", activity);

        this.mapService.addInfoBubble(activity, this.map, this.ui); 
      })
      this.loading = false;
    });
  }

  private createFilterQuery(filters: Partial<ActivityFilters>): Partial<FilterActivitiesParams> {
    const query = {}
    if(filters) {
      query['phrase'] = filters.phrase ?? filters.phrase
      query['weekDay'] = filters.weekDays ?? filters.weekDays
      query['category'] = filters.categories ?? filters.categories
      query['minPrice'] = filters.minPrice ?? filters.minPrice
      query['maxPrice'] = filters.maxPrice ?? filters.maxPrice
    }
    return query;
  }

  private hasNoData(data: Activity[]): boolean {
    return data.length === 0 ? true : false;
  }
}