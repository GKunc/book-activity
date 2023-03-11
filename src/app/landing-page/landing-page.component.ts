import { Component } from '@angular/core';
import { ResizeService } from '../common/services/resize/resize.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent {
  constructor(public resizeService: ResizeService) { }
}
