import { SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';
import { ModalService } from '../common/services/modal/modal.service';
import { NotificationsService } from '../common/services/notifications/notifications.service';
import { ActivityData, instanceOfActivityData } from './activity-data-form/activity-data-form.component';
import { ClientData, instanceOfClientData } from './client-data-form/client-data-form.component';
import { instanceOfLocationData, LocationData } from './location-data-form/location-data-form.component';
import { instanceOfMediaData, MediaData } from './media-data-form/media-data-form.component';

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
  mediaData: MediaData;

  constructor(
    private modalService: ModalService,
    private notificationsService: NotificationsService,
    private activitiesService: ActivitiesService,
  ) { }

  submit(): void {
    this.isLoading = true;
    const activity = this.createActivity();

    this.activitiesService.insertActivity(activity).subscribe((data) => {
      this.isLoading = false;
      this.notificationsService.success('Zajęcia dodane', 'Poczekaj na email potwierdzający weryfijację.');
      this.modalService.close();
    });
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

  next(): void {
    this.currentStep += 1;
    if (this.currentStep === 1) this.stepOneDone = true;
    if (this.currentStep === 2) this.stepTwoDone = true;
  }

  saveData(data: ActivityData | ClientData | LocationData | MediaData): void {
    if (instanceOfActivityData(data)) {
      this.activityData = data;
      console.log('activityData', data);

    }
    else if (instanceOfClientData(data)) {
      this.clientData = data;
      console.log('clientData', data);
    }
    else if (instanceOfLocationData(data)) {
      this.locationData = data;
      console.log('locationData', data);
    }
    else if (instanceOfMediaData(data)) {
      this.mediaData = data;
      console.log('mediaData', data);
    }
  }

  private createActivity(): Activity {
    return {
      guid: getUUID(),
      name: this.activityData.name,
      price: this.activityData.price,
      category: this.activityData.category,
      description: this.activityData.description,
      time: this.activityData.time,
      weekDay: this.activityData.weekDay,
      street: this.locationData.street,
      city: this.locationData.city,
      email: this.clientData.email,
      facebook: this.clientData.facebook,
      instagram: this.clientData.instagram,
      phone: this.clientData.phone,
      www: this.clientData.www,
    }
  }
}

const getUUID = () =>
  (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  );