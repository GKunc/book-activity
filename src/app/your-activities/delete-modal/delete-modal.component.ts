import { Component, Input } from '@angular/core';
import { ActivitiesService, Activity } from 'src/app/common/services/activities/activities.service';
import { ModalService } from 'src/app/common/services/modal/modal.service';
import { NotificationsService } from 'src/app/common/services/notifications/notifications.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.less']
})
export class DeleteModalComponent {

  @Input()
  activity: Activity;

  loading: boolean;

  constructor(
    private modalService: ModalService,
    private activitiesService: ActivitiesService,
    private notificationsService: NotificationsService,
  ) { }

  deleteActivity(): void {
    this.loading = true;
    this.activitiesService.deleteActivity(this.activity.guid).subscribe(() => {
      this.loading = false;
      this.notificationsService.success("Potwierdzenie", "Pomylnie usunięto aktywność");
    });

    this.modalService.close();
  }

  cancel(): void {
    this.modalService.cancel();
  }
}
