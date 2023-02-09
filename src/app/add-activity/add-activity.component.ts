import { SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { ModalService } from '../common/services/modal/modal.service';
import { NotificationsService } from '../common/services/notifications/notifications.service';
import { ActivityData, instanceOfActivityData } from './activity-data-form/activity-data-form.component';
import { ClientData, instanceOfClientData } from './client-data-form/client-data-form.component';
import { instanceOfLocationData, LocationData } from './location-data-form/location-data-form.component';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.less']
})
export class AddActivityComponent {
  user: SocialUser;

  isLoading: boolean = false;

  currentStep = 0;
  stepOneDone: boolean = false;
  stepTwoDone: boolean = false;

  activityData: ActivityData;
  locationData: LocationData;
  clientData: ClientData;

  constructor(
    private modalService: ModalService,
    private notificationsService: NotificationsService,
  ) { }

  submit(): void {
    this.isLoading = true;
    // call db insert
    setTimeout(() => {
      this.isLoading = false;
      this.modalService.close();
      this.notificationsService.success('Zajęcia dodane', 'Poczekaj na email potwierdzający weryfijację.')
    }, 1000);
  }

  disabledMinutes(): number[] {
    return [...Array(61).keys()].filter(i => i % 15 !== 0)
  }

  onIndexChange(index: number): void {
    this.currentStep = index;
  }

  previous(): void {
    this.currentStep -= 1;
  }

  next(formData: ActivityData | ClientData | LocationData): void {
    this.saveData(formData);
    this.currentStep += 1;
    if (this.currentStep === 1) this.stepOneDone = true;
    if (this.currentStep === 2) this.stepTwoDone = true;
  }

  private saveData(data: ActivityData | ClientData | LocationData): void {
    if (instanceOfActivityData(data)) {
      this.activityData = data;
      console.log(data);
    }
    else if (instanceOfClientData(data)) {
      this.clientData = data;
      console.log(data);
    }
    else if (instanceOfLocationData(data)) {
      this.locationData = this.locationData;
      console.log(data);
    }
  }
}