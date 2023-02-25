import { WeekDay } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WEEK_DAYS } from '../week-days.consts';

@Component({
  selector: 'activity-groups-form',
  templateUrl: './activity-groups-form.component.html',
  styleUrls: ['./activity-groups-form.component.less']
})
export class ActivityGroupsFormComponent {
  @Input()
  isLoading: boolean;

  @Output()
  formSubmitted: EventEmitter<GroupsData> = new EventEmitter<GroupsData>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  weekDaysOptions: { value: WeekDay, label: string }[] = WEEK_DAYS;

  form = new FormGroup({
    groups: new FormArray([
      new FormGroup({
        price: new FormControl<number>(0, Validators.required),
        time: new FormControl<Date>(new Date(), Validators.required),
        weekDay: new FormControl<WeekDay>(0, Validators.required),
      }),
    ]),
  })

  constructor(private fb: FormBuilder) { }


  get activityGroups() {
    return this.form.get('groups') as FormArray;
  }


  disabledMinutes(): number[] {
    return [...Array(61).keys()].filter(i => i % 15 !== 0)
  }

  addNewActivity(): void {
    this.activityGroups.push(
      this.fb.group({
        price: [0, Validators.required],
        time: [new Date(), Validators.required],
        weekDay: [null, Validators.required],
      })
    );
  }

  removeActivity(index): void {
    this.activityGroups.removeAt(index);
  }

  previous(): void {
    this.previousForm.emit();
  }

  submit(): void {
    if (this.validateForm()) {
      this.formSubmitted.emit({
        activityGroups: this.createDetailsObject(),
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


  private createDetailsObject(): GroupDetails[] {
    const result = []
    this.activityGroups.value.forEach((details) =>
      result.push({
        price: details.price,
        time: details.time,
        weekDay: details.weekDay,
      })
    );

    return result
  }
}

export interface GroupsData {
  activityGroups: GroupDetails[];
}

export interface GroupDetails {
  price: number,
  time: Date,
  weekDay: WeekDay,
}

export function instanceOfGroupsData(object: any): object is GroupsData {
  return ('groupDetails' in object);
}