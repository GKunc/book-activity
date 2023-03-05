import { Component } from '@angular/core';
import { Activity } from '../common/services/activities/activities.service';
import { ResizeService } from '../common/services/resize/resize.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent {


  activities: Activity[] = [];

  constructor(public resizeService: ResizeService) { }
}
