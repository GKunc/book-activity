import { WeekDay } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
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
    category: [null, [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(200)]],
    activityDetails: this.fb.array([
      this.fb.group({
        price: [0],
        time: [null],
        weekDay: [null],
      })
    ])
  });

  weekDaysOptions: { value: WeekDay, label: string }[] = WEEK_DAYS;
  acitivyCategories: { value: Category, label: string }[] = ACTIVITY_CATEGORIES;

  constructor(private fb: FormBuilder) { }

  get activityDetails() {
    return this.form.get('activityDetails') as FormArray;
  }

  addNewActivity(): void {
    this.activityDetails.push(
      this.fb.group({
        price: [0],
        time: [null],
        weekDay: [null],
      })
    );
  }

  removeActivity(index): void {
    this.activityDetails.removeAt(index);
  }

  disabledMinutes(): number[] {
    return [...Array(61).keys()].filter(i => i % 15 !== 0)
  }

  submit(): void {
    if (this.validateForm()) {
      this.formSubmitted.emit({
        name: this.form.controls.name.value,
        category: this.form.controls.category.value,
        description: this.form.controls.description.value,
        activityDetails: this.createDetailsObject(),
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

  private createDetailsObject(): Details[] {
    const result = []
    this.form.controls.activityDetails.value.forEach((details) =>
      result.push({
        price: details.price,
        time: details.time,
        weekDay: details.weekDay,
      })
    );

    return result
  }
}

export interface ActivityData {
  name: string;
  category: Category;
  description: string;
  activityDetails: Details[];
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
    'description' in object &&
    'activityDetails' in object
  );
}
