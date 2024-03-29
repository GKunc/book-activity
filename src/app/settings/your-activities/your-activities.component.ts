import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { distinctUntilChanged, of } from 'rxjs';
import { AddActivityComponent } from 'src/app/add-activity/add-activity.component';
import { Activity } from 'src/app/common/services/activities/activities.model';
import { ActivitiesService } from 'src/app/common/services/activities/activities.service';
import { InternalUser, LoginService } from 'src/app/common/services/login-service/login.service';
import { ModalService } from 'src/app/common/services/modal/modal.service';
import { Package } from 'src/app/settings/settings.models';
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
  FreePackage: Package = Package.Free;
  user: InternalUser;

  constructor(
    private activitiesService: ActivitiesService,
    private modalService: ModalService,
    private router: Router,
    public loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.getUserActivities();

    this.loginService._user$.pipe(distinctUntilChanged()).subscribe((user) => {
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
    this.router.navigate(['/settings/add-activity']);
    // this.refreshActivitiesOnModalClose(modal);
  }

  editActivity(activity: Activity): void {
    this.router.navigateByUrl('/settings/add-activity', {
      state: { activity: JSON.stringify(activity), isEditing: true },
    });
    // this.refreshActivitiesOnModalClose(modal);
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

    if (user) {
      this.activitiesService.getUserActivities(user.id).subscribe(
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

  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}
