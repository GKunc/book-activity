import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Activity } from 'src/app/common/services/activities/activities.model';

const URL_REGX = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
const PHONE_REGX = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{3})/;

@Component({
  selector: 'client-data-form',
  templateUrl: './client-data-form.component.html',
})
export class ClientDataFormComponent implements OnInit {
  @Input()
  activity: Activity;

  @Input()
  isLoading: boolean;

  @Output()
  formSubmitted: EventEmitter<Partial<Activity>> = new EventEmitter<Partial<Activity>>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone: new FormControl<string>('', [Validators.required, Validators.pattern(PHONE_REGX)]),
    www: new FormControl<string>('', [Validators.minLength(5)]),
    facebook: new FormControl<string>('', [Validators.minLength(5)]),
    instagram: new FormControl<string>('', [Validators.minLength(5)]),
  });

  get phone() {
    return this.form.controls.phone;
  }

  get www() {
    return this.form.controls.www;
  }

  get facebook() {
    return this.form.controls.facebook;
  }

  get instagram() {
    return this.form.controls.instagram;
  }

  ngOnInit(): void {
    if (this.activity) {
      this.form.controls.email.setValue(this.activity.email);
      this.form.controls.phone.setValue(this.activity.phone);
      this.form.controls.www.setValue(this.activity.www);
      this.form.controls.facebook.setValue(this.activity.facebook);
      this.form.controls.instagram.setValue(this.activity.instagram);
    }
  }

  previous(): void {
    this.previousForm.emit();
  }

  submit(): void {
    if (this.validateForm()) {
      this.formSubmitted.emit({
        email: this.form.controls.email.value,
        facebook: this.form.controls.facebook.value,
        instagram: this.form.controls.instagram.value,
        phone: this.form.controls.phone.value,
        www: this.form.controls.www.value,
      });
    }
  }

  private validateForm(): boolean {
    this.form.controls.email.setValue(this.form.controls.email.value?.trim());
    this.form.controls.facebook.setValue(this.form.controls.facebook.value?.trim());
    this.form.controls.instagram.setValue(this.form.controls.instagram.value?.trim());
    this.form.controls.phone.setValue(this.form.controls.phone.value?.trim());
    this.form.controls.www.setValue(this.form.controls.www.value?.trim());

    if (!this.form.valid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    }
    return true;
  }
}
