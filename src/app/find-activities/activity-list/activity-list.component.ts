import {  ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Activity } from 'src/app/common/services/activities/activities.service';

@Component({
  selector: 'activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.less']
})
export class ActivityListComponent implements OnChanges {
  @Input()
  activities: Activity[];

  @Input()
  hasMoreData: boolean;
  
  @Output()
  loadMore: EventEmitter<void> = new EventEmitter();

  constructor(
    private cdr: ChangeDetectorRef,
    ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['activities']?.firstChange) {
      this.cdr.detectChanges();
    }
  }
}

