import { WeekDay } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Activity, GroupDetails } from 'src/app/common/services/activities/activities.model';
import { WEEK_DAYS } from '../../common/consts/week-days.consts';

@Component({
  selector: 'activity-groups-form',
  templateUrl: './activity-groups-form.component.html',
  styleUrls: ['./activity-groups-form.component.less'],
})
export class ActivityGroupsFormComponent implements OnInit {
  @Input()
  activity: Activity;

  @Input()
  isLoading: boolean;

  @Output()
  formSubmitted: EventEmitter<Partial<Activity>> = new EventEmitter<Partial<Activity>>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  weekDaysOptions: { value: WeekDay; label: string }[] = WEEK_DAYS;

  addedGroups: GroupDetails[] = [];

  form = new FormGroup({
    name: new FormControl<string>(null, Validators.required),
    duration: new FormControl<number>(null, Validators.required),
    price: new FormControl<number>(null, Validators.required),
    time: new FormControl<Date>(null, Validators.required),
    weekDay: new FormControl<WeekDay>(null, Validators.required),
  });

  ngOnInit(): void {
    if (this.activity.groups) {
      this.addedGroups = this.activity.groups;
    }
  }

  disabledMinutes(): number[] {
    return [...Array(61).keys()].filter((i) => i % 15 !== 0);
  }

  addNewGroup(): void {
    this.form.controls.name.setValue(this.form.controls.name.value.trim());

    if (this.validateForm()) {
      this.addedGroups.push({
        name: this.form.controls.name.value,
        duration: this.form.controls.duration.value,
        price: this.form.controls.price.value,
        time: this.form.controls.time.value,
        weekDay: this.form.controls.weekDay.value,
      });

      this.form.reset();
    }
  }

  removeActivity(index): void {
    this.addedGroups.splice(index, 1);
  }

  previous(): void {
    this.previousForm.emit();
  }

  submit(): void {
    if (this.addedGroups.length > 0) {
      this.formSubmitted.emit({
        groups: this.addedGroups,
      });
    } else if (this.validateForm()) {
      this.addNewGroup();
      this.formSubmitted.emit({
        groups: this.addedGroups,
      });
    }
  }

  private validateForm(): boolean {
    this.form.controls.name.setValue(this.form.controls.name.value.trim());

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
