import { Component, OnInit } from '@angular/core';
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
  noData: boolean;
  userLogged: boolean = false;

  constructor(
    private activitiesService: ActivitiesService,
    private loginService: LoginService,
    private modalService: ModalService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.getUserActivities();
  }

  addActivity(): void {
    this.modalService.createModal(AddActivityComponent, 'Dodaj swoje zajęcia', 500);
  }


  editActivity(activity: Activity): void {
    this.modalService.createModal(AddActivityComponent, 'Dodaj swoje zajęcia', 500, { activity, isEditing: true });
  }

  deleteActivity(activity: Activity): void {
    const modal = this.modalService.createModal(DeleteModalComponent, "Czy na pewno chcesz usunąć zajęcia?", 400, { activity });
    modal.afterClose.subscribe(() => {
      this.notificationsService.success("Potwierdzenie", "Pomylnie usunięto aktywność");
      this.getUserActivities();
    });
  }

  getUserActivities(): void {
    this.loading = true;
    this.loginService._user$.subscribe(user => {
      if (user) {
        this.userLogged = true;
        this.activitiesService.getUserActivities(user?.id).subscribe(data => {
          this.activities = data;
          this.noData = this.hasNoData(data);
          this.loading = false;
        });
      }
    })

  }

  private hasNoData(data: Activity[]): boolean {
    return data.length === 0 ? true : false;
  }
}
