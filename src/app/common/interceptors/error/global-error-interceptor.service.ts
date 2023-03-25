import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NotificationsService } from '../../services/notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorInterceptor implements ErrorHandler {
  constructor(
    private notificationsService: NotificationsService,
    private zone: NgZone
  ) {}

  handleError(error: any) {
    if (!environment.production) {
      this.zone.run(() => {
        console.log(error);
      
        this.notificationsService.error(
          `${environment.production}`,
          error?.message || 'Undefined client error',
        )
      });
    }
  }
}