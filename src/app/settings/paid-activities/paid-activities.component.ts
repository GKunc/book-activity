import { Component } from '@angular/core';

@Component({
  selector: 'app-paid-activities',
  templateUrl: './paid-activities.component.html',
  styleUrls: ['./paid-activities.component.less'],
})
export class PaidActivitiesComponent {
  loading: boolean = false;
  error: boolean = false;
  noData: boolean = false;

  constructor() {}
}
