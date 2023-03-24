import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { AddActivityComponent } from '../add-activity/add-activity.component';
import { ActivitiesService, Activity } from '../common/services/activities/activities.service';
import { LoginService } from '../common/services/login-service/login.service';
import { ModalService } from '../common/services/modal/modal.service';
import { NotificationsService } from '../common/services/notifications/notifications.service';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@Component({
  selector: 'app-your-activities',
  templateUrl: './your-activities.component.html',
  styleUrls: ['./your-activities.component.less']
})
export class YourActivitiesComponent implements OnInit {
  activities: Activity[];
  loading: boolean;
  error: boolean;
  noData: boolean;
  userLogged = false;

  constructor(
    private activitiesService: ActivitiesService,
    private modalService: ModalService,
    private notificationsService: NotificationsService,
    public loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.getUserActivities();
    this.loginService._user$.subscribe((user) => {
      if(user) {
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
    this.modalService.createModal(AddActivityComponent, 'Dodaj swoje zajęcia', 500);
  }


  editActivity(activity: Activity): void {
    this.modalService.createModal(AddActivityComponent, 'Dodaj swoje zajęcia', 500, { activity, isEditing: true });
  }

  deleteActivity(activity: Activity): void {
    const modal = this.modalService.createModal(DeleteModalComponent, "Czy na pewno chcesz usunąć zajęcia?", 400, { activity });
    modal.afterClose.subscribe((result) => {
      if(result?.success) {
        this.getUserActivities();
      }
    });
  }

  getUserActivities(): void {
    this.loading = true;
    const user = this.loginService.user;
    
    this.activitiesService.getUserActivities(user?.id).subscribe(data => {
      this.error = false;
      this.activities = data;
      this.noData = this.hasNoData(data);
      this.loading = false;
    },
    () => {
      this.error = true;
      this.loading = false;
      this.activities = [];
      return of(null);
    });
  }

  private hasNoData(data: Activity[]): boolean {
    return data.length === 0 ? true : false;
  }
}
