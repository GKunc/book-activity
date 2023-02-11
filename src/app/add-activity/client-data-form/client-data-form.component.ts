import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

const URL_REGX = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

@Component({
  selector: 'client-data-form',
  templateUrl: './client-data-form.component.html',
})
export class ClientDataFormComponent {
  @Input()
  isLoading: boolean;

  @Output()
  formSubmitted: EventEmitter<ClientData> = new EventEmitter<ClientData>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    phone: [null, [Validators.required]],
    www: ['', [Validators.minLength(30), Validators.maxLength(200)]],
    facebook: [null, [Validators.pattern(URL_REGX)]],
    instagram: [null, [Validators.pattern(URL_REGX)]],
  });


  constructor(private fb: FormBuilder) { }

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

export interface ClientData {
  email: string;
  facebook: string;
  instagram: string;
  phone: string;
  www: string;
}

export function instanceOfClientData(object: any): object is ClientData {
  return ('email' in object &&
    'facebook' in object &&
    'instagram' in object &&
    'phone' in object &&
    'www' in object);
}