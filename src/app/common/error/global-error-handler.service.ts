import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { NotificationsService } from '../services/notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private notificationsService: NotificationsService,
    private zone: NgZone
  ) {}

  handleError(error: any) {
    this.zone.run(() =>
      this.notificationsService.error(
        'Wystąpił niespodziewany błąd',
        error?.message || 'Undefined client error',
      )
    );

    console.error('Error from global error handler', error);
  }
}