import { WeekDay } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ACTIVITY_CATEGORIES, Category } from '../category.consts';
import { WEEK_DAYS } from '../week-days.consts';

@Component({
  selector: 'activity-data-form',
  templateUrl: './activity-data-form.component.html',
})
export class ActivityDataFormComponent {
  @Output()
  formSubmitted: EventEmitter<ActivityData> = new EventEmitter<ActivityData>();

  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    category: new FormControl<Category>(null, Validators.required),
    description: new FormControl<string>('', [Validators.required, Validators.minLength(30), Validators.maxLength(200)]),
  });

  weekDaysOptions: { value: WeekDay, label: string }[] = WEEK_DAYS;
  acitivyCategories: { value: Category, label: string }[] = ACTIVITY_CATEGORIES;

  submit(): void {
    if (this.validateForm()) {
      this.formSubmitted.emit({
        name: this.form.controls.name.value,
        category: this.form.controls.category.value,
        description: this.form.controls.description.value,
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
  category: Category;
  description: string;
}

export interface Details {
  price: number;
  time: string;
  weekDay: WeekDay;
}

export function instanceOfActivityData(object: any): object is ActivityData {
  return (
    'name' in object &&
    'category' in object &&
    'description' in object
  );
}
