import { ElementRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/common/consts/category.consts';
import { environment } from 'src/environments/environment';
import { CategoryPipe } from '../../pipes/category.pipe';
import { Activity } from '../activities/activities.model';

const CATEGORY_COLOR_MAP = new Map<Category, { backgroundColor: string; fillColor: string }>([
  [0, { backgroundColor: '#ff5050', fillColor: '#bf0003' }],
  [1, { backgroundColor: 'green', fillColor: '#54db54' }],
  [2, { backgroundColor: 'darkorange', fillColor: 'orange' }],
  [3, { backgroundColor: '#c8c834', fillColor: 'yellow' }],
  [4, { backgroundColor: '#0060ae', fillColor: '#008dff' }],
  [5, { backgroundColor: '#0060ae', fillColor: '#008dff' }],
  [6, { backgroundColor: '#0060ae', fillColor: '#008dff' }],
  [7, { backgroundColor: '#0060ae', fillColor: '#008dff' }],
  [8, { backgroundColor: '#0060ae', fillColor: '#008dff' }],
]);

const INITIAL_MAP_ZOOM = 13;

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private router: Router, private categoryPipe: CategoryPipe) {}

  lat = 50.04;
  lng = 19.94;
  loadMap(
    mapDiv: ElementRef,
    lat: number = 50.04,
    lng: number = 19.94
  ): { map: H.Map; ui: H.ui.UI; platform: H.service.Platform } {
    if (mapDiv) {
      mapDiv.nativeElement.innerHTML = '';

      const platform = new H.service.Platform({
        apikey: environment.HERE_MAPS_API_KEY,
      });

      const layers = platform.createDefaultLayers();
      const map = new H.Map(mapDiv.nativeElement, layers.vector.normal.map, {
        pixelRatio: window.devicePixelRatio,
        center: { lat, lng },
        zoom: INITIAL_MAP_ZOOM,
      });
      const ui = H.ui.UI.createDefault(map, layers);
      const mapEvents = new H.mapevents.MapEvents(map);
      new H.mapevents.Behavior(mapEvents);

      window.addEventListener('resize', () => {
        map.getViewPort().resize();
      });

      return { map, ui, platform };
    }

    throw new Error('Error przy tworzeniu mapy');
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

  removeAllBubbles(map: H.Map): void {
    map?.removeObjects(map.getObjects());
  }

  addInfoBubble(activity: Activity, map: H.Map, ui: H.ui.UI) {
    const group = new H.map.Group();
    map.addObject(group);

    group.addEventListener(
      'tap',
      (evt) => {
        const bubble = new H.ui.InfoBubble(
          { lat: activity.coordinates.lat, lng: activity.coordinates.lng },
          {
            content: (evt.target as any).getData(),
          }
        );
        ui.getBubbles().forEach((bub) => ui.removeBubble(bub));
        ui.addBubble(bubble);
        document.getElementById(`details-${activity.guid}`).addEventListener('click', () => {
          this.navigateToDetials(activity);
        });
      },
      false
    );

    if (activity.coordinates) {
      this.addMarkerToGroup(
        group,
        { lat: activity.coordinates?.lat, lng: activity.coordinates?.lng },
        `<div style='width: 200px;'><h2 style='margin-bottom: 0;'>${activity.name}</h2></div>` +
          `<div style='color: rgba(0,0,0,.45);'>${this.categoryPipe.transform(activity.category)}</div>` +
          `<div>${activity.street}</div>` +
          `<div id='details-${activity.guid}' (click)='navigateToDetials(${activity})' style='color: purple; cursor: pointer;'>Zobacz</div>`,
        activity
      );
    }
  }

  private navigateToDetials(activity: Activity): void {
    this.router.navigate(['/detail/', activity.guid]);
  }
}
