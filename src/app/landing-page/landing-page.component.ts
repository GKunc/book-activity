import { Component, OnInit } from '@angular/core';
import { Activity } from '../common/services/activities/activities.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent implements OnInit {

  activities: Activity[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
