import { Component, Input, OnInit } from '@angular/core';
import { Activity } from '../common/services/activities/activities.model';
import { ActivitiesService } from '../common/services/activities/activities.service';
import { ModalService } from '../common/services/modal/modal.service';
import { NotificationsService } from '../common/services/notifications/notifications.service';
import { v4 as uuidv4 } from 'uuid';
import { InternalUser, LoginService } from '../common/services/login-service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.less'],
})
export class AddActivityComponent implements OnInit {
  @Input()
  activity: Activity;

  @Input()
  isEditing = false;

  user: InternalUser;

  isLoading = false;

  guid: string = uuidv4();

  currentStep = 0;

  groupsDataEnabled = false;
  locationDataEnabled = false;
  clientDataEnabled = false;
  mediaDataEnabled = false;

  state: any;

  constructor(
    private loginService: LoginService,
    private modalService: ModalService,
    private notificationsService: NotificationsService,
    private activitiesService: ActivitiesService,
    private router: Router
  ) {
    this.state = this.router.getCurrentNavigation()?.extras?.state;
  }

  ngOnInit(): void {
    if (this.state) {
      this.activity = JSON.parse(history.state.activity) as Activity;
      this.isEditing = history.state.isEditing;
    }
    if (this.activity) {
      this.enableAllSteps();
    }
  }

  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  submit(): void {
    this.isLoading = true;
    const activity = this.activity;

    if (this.isEditing) {
      activity.guid = this.activity.guid;
      this.activitiesService.editActivity(this.activity).subscribe(
        () => {
          this.isLoading = false;
          this.notificationsService.success('Sukces', 'Zajęcia edytowano poprawnie.');
          this.modalService.close();
        },
        () => {
          this.isLoading = false;
          this.notificationsService.error('Wystąpił problem', 'Nie mozna bylo dodac zajec. Sprobuj ponownie');
        }
      );
      return;
    }
    this.activitiesService
      .insertActivity({ ...activity, guid: this.guid, createdBy: this.loginService.user?.id })
      .subscribe(
        () => {
          this.isLoading = false;
          this.notificationsService.success('Zajęcia dodane', 'Poczekaj na email potwierdzający weryfikację.');
          this.modalService.close();
        },
        () => {
          this.isLoading = false;
          this.notificationsService.error('Wystąpił problem', 'Nie mozna bylo dodac zajec. Sprobuj ponownie');
        }
      );
  }

  disabledMinutes(): number[] {
    return [...Array(61).keys()].filter((i) => i % 15 !== 0);
  }

  onIndexChange(index: number): void {
    this.currentStep = index;
  }

  previous(): void {
    this.currentStep -= 1;
  }

  next(): void {
    this.currentStep += 1;

    switch (this.currentStep) {
      case 1:
        this.groupsDataEnabled = true;
        break;
      case 2:
        this.locationDataEnabled = true;
        break;
      case 3:
        this.clientDataEnabled = true;
        break;
      case 4:
        this.mediaDataEnabled = true;
        break;
    }
  }

  saveData(data: Partial<Activity>): void {
    this.activity = this.updateActivity(data);
  }

  get disableGroupsStep(): boolean {
    return !!this.activity || !this.activity.description.length || !this.activity.name || !this.activity.category;
  }

  private enableAllSteps(): void {
    this.groupsDataEnabled = true;
    this.locationDataEnabled = true;
    this.clientDataEnabled = true;
    this.mediaDataEnabled = true;
  }

  private updateActivity(data: Partial<Activity>): Activity {
    return {
      ...this.activity,
      ...data,
    };
  }
}
