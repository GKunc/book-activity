import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ACTIVITY_FILTERS } from '../common/consts/local-storage.consts';
import { LocalStorageService } from '../common/services/local-storage/local-storage.service';
import { ResizeService } from '../common/services/resize/resize.service';
import { ActivityFilters, ViewType } from '../shared/activity-filters/activity-filters.model';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less'],
})
export class LandingPageComponent {
  constructor(
    public resizeService: ResizeService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  openLoginModal(): void {
    this.router.navigate(['sign']);
  }

  openRegisterModal(): void {
    this.router.navigate(['register']);
  }

  goToActivityList(): void {
    const filters: ActivityFilters = this.localStorageService.getItem<ActivityFilters>(ACTIVITY_FILTERS);
    this.localStorageService.setItem(ACTIVITY_FILTERS, { ...filters, viewType: ViewType.List });
    this.router.navigate(['/find-activities']);
  }

  goToActivityMap(): void {
    const filters: ActivityFilters = this.localStorageService.getItem<ActivityFilters>(ACTIVITY_FILTERS);
    this.localStorageService.setItem(ACTIVITY_FILTERS, { ...filters, viewType: ViewType.Map });
    this.router.navigate(['/find-activities']);
  }
}
