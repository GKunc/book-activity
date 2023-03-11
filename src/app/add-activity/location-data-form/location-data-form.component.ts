import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Activity } from 'src/app/common/services/activities/activities.service';

@Component({
  selector: 'location-data-form',
  templateUrl: './location-data-form.component.html',
  styleUrls: ['./location-data-form.component.less']
})
export class LocationDataFormComponent implements OnInit {
  @Input()
  activity: Activity;

  @Output()
  formSubmitted: EventEmitter<LocationData> = new EventEmitter<LocationData>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  googleMapsSrc: string = '';
  googleMapsSrcParsed: string = '';

  form = new FormGroup({
    street: new FormControl<string>('', [Validators.required]),
    city: new FormControl<string>('', [Validators.required]),
  });

  ngOnInit(): void {
    if (this.activity) {
      this.form.controls.street.setValue(this.activity.street)
      this.form.controls.city.setValue(this.activity.city)
      this.googleMapsSrc = this.activity.googleMapsSrc;
      this.googleMapsSrcParsed = this.activity.googleMapsSrc;
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
        googleMapsSrc: this.googleMapsSrcParsed,
        coordinates: this.getCoordinatesFromLink(this.googleMapsSrcParsed),
      })
    }
  }

  getCoordinatesFromLink(value: string): { lng: number, lat: number } {
    const startLng = value.indexOf('2d') + 2;
    const lng = value.slice(startLng, startLng + 10);
    const startLat = value.indexOf('3d') + 2;
    const lat = value.slice(startLat, startLat + 10);
    return { lng: Number(lng), lat: Number(lat) };
  }

  googleMapsSrcChanges(value: string): void {
    this.googleMapsSrcParsed = this.getSrcFromIfarce(value);
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

  private getSrcFromIfarce(value: string): string {
    const startIndex = value.indexOf('src');

    if (value.includes('#')) {
      return "";
    }

    if (startIndex === -1) {
      return "";
    }

    const sub = value.substring(startIndex + 5);
    const endIndex = sub.indexOf('"');

    return sub.substring(0, endIndex);
  }
}

export interface LocationData {
  street: string;
  city: string;
  googleMapsSrc: string;
  coordinates: { lng: number, lat: number };
}

export function instanceOfLocationData(object: any): object is LocationData {
  return ('street' in object && 'city' in object);
}