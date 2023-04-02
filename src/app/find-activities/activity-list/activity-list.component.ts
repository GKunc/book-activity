import {  ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Activity } from 'src/app/common/services/activities/activities.model';

@Component({
  selector: 'activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.less']
})
export class ActivityListComponent implements OnChanges {
  @Input()
  activities: Activity[];

  @Output()
  loadMore: EventEmitter<void> = new EventEmitter();

  constructor(
    private cdr: ChangeDetectorRef,
    ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes", changes);
    
    if(!changes['activities']?.firstChange) {
      this.cdr.detectChanges();
    }
  }
}

