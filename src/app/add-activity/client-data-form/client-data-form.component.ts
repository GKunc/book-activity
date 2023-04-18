import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Activity } from 'src/app/common/services/activities/activities.model';

const URL_REGX = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

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
  formSubmitted: EventEmitter<ClientData> = new EventEmitter<ClientData>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone: new FormControl<string>('', [Validators.required]),
    www: new FormControl<string>('', [Validators.minLength(30), Validators.maxLength(200)]),
    facebook: new FormControl<string>('', [Validators.pattern(URL_REGX)]),
    instagram: new FormControl<string>('', [Validators.pattern(URL_REGX)]),
  });

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
        email: this.form.controls['email'].value,
        facebook: this.form.controls['facebook'].value,
        instagram: this.form.controls['instagram'].value,
        phone: this.form.controls['phone'].value,
        www: this.form.controls['www'].value,
      });
    }
  }

  private validateForm(): boolean {
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

export interface ClientData {
  email: string;
  facebook: string;
  instagram: string;
  phone: string;
  www: string;
}

export function instanceOfClientData(object: any): object is ClientData {
  return 'email' in object && 'facebook' in object && 'instagram' in object && 'phone' in object && 'www' in object;
}
