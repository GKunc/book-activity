import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private notification: NzNotificationService
  ) { }

  success(title: string, message: string): void {
    this.notification.success(title, message)
  }

  error(title: string, message: string): void {
    this.notification.error(title, message)
  }
}
