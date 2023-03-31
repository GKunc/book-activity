import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Activity } from '../../common/services/activities/activities.service';
import { MapService } from '../../common/services/map-service/map-service.service';
import { ResizeService } from '../../common/services/resize/resize.service';


@Component({
  selector: 'activity-map',
  templateUrl: './activity-map.component.html',
  styleUrls: ['./activity-map.component.less']
})
export class ActivityMapComponent implements OnInit , AfterViewInit, OnChanges {
  @ViewChild('map') mapDiv?: ElementRef;

  @Input()
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
    private mapService: MapService,
  ) { }

  ngAfterViewInit(): void {
    this.resizeMapToFitScreen();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['activities']?.firstChange) {
      this.mapService.removeAllBubbles(this.map);
      this.activities.forEach(activity => {
        this.mapService.addInfoBubble(activity, this.map, this.ui); 
      })
    }
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

      this.mapService.removeAllBubbles(this.map);
      this.activities.forEach(activity => {
        this.mapService.addInfoBubble(activity, this.map, this.ui); 
      })
    });
  }

  private resizeMapToFitScreen(): void {
    this.mapDiv.nativeElement.style.height = window.innerHeight - 250 + "px";
    if(this.resizeService._isSmall$.getValue()) {
    this.mapDiv.nativeElement.style.width = window.innerWidth + "px";
    } else {
      this.mapDiv.nativeElement.style.width = window.innerWidth - 280 + "px";
    }
  }
}