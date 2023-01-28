import { Component, OnInit } from '@angular/core';
import { FindActivitiesService } from './find-activities.service';

@Component({
  selector: 'app-find-activities',
  templateUrl: './find-activities.component.html',
  styleUrls: ['./find-activities.component.less']
})
export class FindActivitiesComponent implements OnInit {

  constructor(private findActivitiesService: FindActivitiesService) { }

  ngOnInit(): void {
    this.findActivitiesService.getActivities();
  }
}
