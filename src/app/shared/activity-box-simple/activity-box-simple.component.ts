import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Activity } from 'src/app/common/services/activities/activities.model';

@Component({
  selector: 'activity-box-simple',
  templateUrl: './activity-box-simple.component.html',
  styleUrls: ['./activity-box-simple.component.less'],
})
export class ActivityBoxSimpleComponent {
  @Input()
  activity: Activity;

  @Input()
  hideEditButton: boolean = false;

  @Input()
  hidePrice: boolean = false;

  @Output()
  editActivity: EventEmitter<Activity> = new EventEmitter();

  @Output()
  deleteActivity: EventEmitter<Activity> = new EventEmitter();
}
