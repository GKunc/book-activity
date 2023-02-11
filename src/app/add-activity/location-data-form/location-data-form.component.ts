import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'location-data-form',
  templateUrl: './location-data-form.component.html',
})
export class LocationDataFormComponent {
  @Output()
  formSubmitted: EventEmitter<LocationData> = new EventEmitter<LocationData>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  form = this.fb.group({
    street: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    city: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder) { }

  previous(): void {
    this.previousForm.emit();
  }

  submit(): void {
    if (this.validateForm()) {
      this.formSubmitted.emit({
        street: this.form.controls.street.value,
        city: this.form.controls.city.value,
      })
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
}

export interface LocationData {
  street: string;
  city: string;
}

export function instanceOfLocationData(object: any): object is LocationData {
  return ('street' in object && 'city' in object);
}