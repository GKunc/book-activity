import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';
import { MapService } from '../common/services/map-service/map-service.service';
import { ResizeService } from '../common/services/resize/resize.service';
import { ActivityFilters, ACTIVITY_FILTERS } from '../shared/activity-filters/activity-filters.component';


@Component({
  selector: 'app-activity-map',
  templateUrl: './activity-map.component.html',
  styleUrls: ['./activity-map.component.less']
})
export class ActivityMapComponent implements OnInit , AfterViewInit{
  @ViewChild('map') mapDiv?: ElementRef;

  activities: Activity[];

  lat = 50.04;
  lng = 19.94;

  loading = false;
  noData = true;
  error = false;

  private map?: H.Map;
  private ui?: H.ui.UI;
  private platform?: H.service.Platform;
   
  constructor(
    public resizeService: ResizeService,
    private activitiesService: ActivitiesService,
    private mapService: MapService,
  ) { }

  ngAfterViewInit(): void {
    this.resizeMapToFitScreen();
  }

  ngOnInit(): void {
    window.addEventListener('resize', () => this.resizeMapToFitScreen());
    
    this.loading = true;
    this.error = false;
    navigator.geolocation.getCurrentPosition((position) => {
      this.lng = position.coords.longitude;
      this.lat = position.coords.latitude;
      const { map, ui, platform } = this.mapService.loadMap(this.mapDiv, this.lat, this.lng);
      this.map = map;
      this.ui = ui;
      this.platform = platform;

      this.onSubmitFilters(JSON.parse(localStorage.getItem(ACTIVITY_FILTERS)));
    });
  }

  onSubmitFilters(filters: Partial<ActivityFilters>): void {
    this.loading = true;
    this.noData = false;
    this.mapService.removeAllBubbles(this.map);
    filters.limit = 100;
    
    this.activitiesService.filterActivities(filters).subscribe(data => {
      this.error = false;
      this.noData = this.hasNoData(data);
      this.activities = data;
      this.activities.forEach(activity => {
        this.mapService.addInfoBubble(activity, this.map, this.ui); 
      })
      this.loading = false;
    },
    (error) => {
      if (
        error.status !== 403
      ) {
        this.error = true;
        this.loading = false;
      }
    });
  }

  private hasNoData(data: Activity[]): boolean {
    return data.length === 0 ? true : false;
  }

  private resizeMapToFitScreen(): void {
    this.mapDiv.nativeElement.style.height = window.innerHeight - 150 + "px";
    if(this.resizeService._isSmall$.getValue()) {
    this.mapDiv.nativeElement.style.width = window.innerWidth + "px";
    } else {
      this.mapDiv.nativeElement.style.width = window.innerWidth - 280 + "px";
    }
  }
}