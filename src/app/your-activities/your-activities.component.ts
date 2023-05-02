import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { AddActivityComponent } from '../add-activity/add-activity.component';
import { Activity } from '../common/services/activities/activities.model';
import { ActivitiesService } from '../common/services/activities/activities.service';
import { LoginService } from '../common/services/login-service/login.service';
import { ModalService } from '../common/services/modal/modal.service';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@Component({
  selector: 'app-your-activities',
  templateUrl: './your-activities.component.html',
  styleUrls: ['./your-activities.component.less'],
})
export class YourActivitiesComponent implements OnInit {
  activities: Activity[];
  loading: boolean;
  error: boolean;
  noData: boolean;
  userLogged = false;
  limitNumberOfActivities: number = 2;

  constructor(
    private activitiesService: ActivitiesService,
    private modalService: ModalService,
    public loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.getUserActivities();
    this.loginService._user$.subscribe((user) => {
      if (user) {
        this.userLogged = true;
        this.getUserActivities();
      } else {
        this.userLogged = false;
        this.activities = [];
        this.noData = false;
      }
    });
  }

  addActivity(): void {
    const modal = this.modalService.createModal(AddActivityComponent, 'Dodaj swoje zajęcia', 500, {}, false);
    this.refreshActivitiesOnModalClose(modal);
  }

  editActivity(activity: Activity): void {
    const modal = this.modalService.createModal(
      AddActivityComponent,
      'Dodaj swoje zajęcia',
      500,
      { activity, isEditing: true },
      false
    );
    this.refreshActivitiesOnModalClose(modal);
  }

  deleteActivity(activity: Activity): void {
    const modal = this.modalService.createModal(DeleteModalComponent, 'Czy na pewno chcesz usunąć zajęcia?', 400, {
      activity,
    });
    this.refreshActivitiesOnModalClose(modal);
  }

  getUserActivities(): void {
    this.loading = true;
    const user = this.loginService.user;

    this.activitiesService.getUserActivities(user?.id).subscribe(
      (data) => {
        this.error = false;
        this.activities = data;
        this.noData = this.hasNoData(data);
        this.loading = false;
      },
      (error) => {
        if (error.status !== 403) {
          this.error = true;
          this.loading = false;
          this.activities = [];
        }
        return of(null);
      }
    );
  }

  private hasNoData(data: Activity[]): boolean {
    return data.length === 0 ? true : false;
  }

  private refreshActivitiesOnModalClose(modal: NzModalRef): void {
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.getUserActivities();
      }
    });
  }
}
