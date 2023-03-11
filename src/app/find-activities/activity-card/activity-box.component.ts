import { Component, Input } from '@angular/core';
import { Activity } from '../../common/services/activities/activities.service';

@Component({
  selector: 'activity-box',
  templateUrl: './activity-box.component.html',
  styleUrls: ['./activity-box.component.less']
})
export class ActivityBoxComponent {
  @Input()
  activity: Activity;
}
