import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Activity } from 'src/app/common/services/activities/activities.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'location-data-form',
  templateUrl: './location-data-form.component.html',
  styleUrls: ['./location-data-form.component.less']
})
export class LocationDataFormComponent implements OnInit {
  @ViewChild('map') mapDiv?: ElementRef;

  @Input()
  activity: Activity;

  @Output()
  formSubmitted: EventEmitter<LocationData> = new EventEmitter<LocationData>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  coordinatesString = '';

  form = new FormGroup({
    street: new FormControl<string>('', [Validators.required]),
    city: new FormControl<string>('', [Validators.required]),
  });

  platform: H.service.Platform;
  loading = false;

  private map?: H.Map;
  private layers?: H.service.DefaultLayers;

  ngOnInit(): void {
    if (this.activity) {
      this.form.controls.street.setValue(this.activity.street)
      this.form.controls.city.setValue(this.activity.city)
      this.coordinatesString = `${this.activity.coordinates.lat}, ${this.activity.coordinates.lng}`;
    }
  }

  previous(): void {
    this.previousForm.emit();
  }

  submit(): void {
    if (this.validateForm()) {
      this.formSubmitted.emit({
        street: this.form.controls['street'].value,
        city: this.form.controls['city'].value,
        coordinates: this.getCoordinates(this.coordinatesString),
      })
    }
  }

  coordinatesChanges(value: string): void {
    this.coordinatesString = value;

    this.map = null;
    this.mapDiv.nativeElement.innerHTML = '';
    const { lat, lng } = this.getCoordinates(value);

    if (!this.map && this.mapDiv && lat && lng) {
      this.platform = new H.service.Platform({
        'apikey': environment.HERE_MAPS_API_KEY
      });

      this.layers = this.platform.createDefaultLayers();
      this.map = new H.Map(
        this.mapDiv.nativeElement,
        this.layers.vector.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: { lat, lng },
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

      const marker = new H.map.Marker({ lat, lng }, { icon });
      const group = new H.map.Group();
      this.map.addObject(group);
      group.addObject(marker);
    }
  }

  private validateForm(): boolean {
    // if (!this.form.valid) {
    //   Object.values(this.form.controls).forEach(control => {
    //     if (control.invalid) {
    //       control.markAsDirty();
    //       control.updateValueAndValidity({ onlySelf: true });
    //     }
    //   });
    //   return false;
    // }
    return true;
  }

  private getCoordinates(value: string): { lat: number, lng: number } {
    const coordinates = value.trim().split(' ');
    return { lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1]) };
  }
}

export interface LocationData {
  street: string;
  city: string;
  coordinates: { lng: number, lat: number };
}

export function instanceOfLocationData(object: any): object is LocationData {
  return ('street' in object && 'city' in object);
}