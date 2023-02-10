import { WeekDay } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ACTIVITY_CATEGORIES, Category } from '../category.consts';
import { WEEK_DAYS } from '../week-days.consts';

@Component({
  selector: 'activity-data-form',
  templateUrl: './activity-data-form.component.html',
})
export class ActivityDataFormComponent {
  @Output()
  formSubmitted: EventEmitter<ActivityData> = new EventEmitter<ActivityData>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
    category: [null, [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(200)]],
    time: [null, [Validators.required]],
    weekDay: [null, [Validators.required]],
  });

  weekDaysOptions: { value: WeekDay, label: string }[] = WEEK_DAYS;
  acitivyCategories: { value: Category, label: string }[] = ACTIVITY_CATEGORIES;

  constructor(private fb: FormBuilder) { }

  disabledMinutes(): number[] {
    return [...Array(61).keys()].filter(i => i % 15 !== 0)
  }

  submit(): void {
    if (this.validateForm()) {
      this.formSubmitted.emit({
        name: this.form.controls.name.value,
        price: this.form.controls.price.value,
        category: this.form.controls.category.value,
        description: this.form.controls.description.value,
        time: this.form.controls.time.value,
        weekDay: this.form.controls.weekDay.value,
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

export interface ActivityData {
  name: string;
  price: number;
  category: Category;
  description: string;
  time: string;
  weekDay: WeekDay;
}

export function instanceOfActivityData(object: any): object is ActivityData {
  return ('name' in object &&
    'price' in object &&
    'category' in object &&
    'description' in object &&
    'time' in object &&
    'weekDay' in object);
}
