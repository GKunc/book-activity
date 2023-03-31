import {  Component, EventEmitter, Input, Output } from '@angular/core';
import { Activity } from 'src/app/common/services/activities/activities.service';
import { ResizeService } from 'src/app/common/services/resize/resize.service';

@Component({
  selector: 'activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.less']
})
export class ActivityListComponent {
  @Input()
  activities: Activity[];

  @Input()
  hasMoreData: boolean;
  
  @Output()
  loadMore: EventEmitter<void> = new EventEmitter();

  constructor(
    public resizeService: ResizeService,
  ) { }
}

