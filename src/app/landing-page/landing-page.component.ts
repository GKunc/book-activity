import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ACTIVITY_FILTERS } from '../common/consts/local-storage.consts';
import { ModalService } from '../common/services/modal/modal.service';
import { ResizeService } from '../common/services/resize/resize.service';
import { ActivityFilters, ViewType } from '../shared/activity-filters/activity-filters.model';
import { SignComponent } from '../sign/sign.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less'],
})
export class LandingPageComponent {
  constructor(public resizeService: ResizeService, private modalService: ModalService, private router: Router) {}

  openLoginModal(): void {
    this.modalService.createModal(SignComponent, 'Login', 440, { showLogin: false });
  }

  goToActivityMap(): void {
    const filters: ActivityFilters = JSON.parse(localStorage.getItem(ACTIVITY_FILTERS));
    localStorage.setItem(ACTIVITY_FILTERS, JSON.stringify({ ...filters, viewType: ViewType.Map }));
    this.router.navigate(['/find-activities']);
  }
}
