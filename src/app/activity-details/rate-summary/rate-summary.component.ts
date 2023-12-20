import { Component, Input } from '@angular/core';

@Component({
  selector: 'rate-summary',
  templateUrl: './rate-summary.component.html',
  styleUrls: ['./rate-summary.component.less'],
})
export class RateSummaryComponent {
  @Input()
  avgRate: number;

  @Input()
  starsMap: Map<number, number>;

  @Input()
  numberOfRates: number;
}
