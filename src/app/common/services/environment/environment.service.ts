import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  isProd: boolean = true;

  checkEnvironment() {
    if (window.location.href.includes('localhost') && localStorage.getItem(environment.ADMIN_TOKEN) !== null) {
      this.isProd = false;
      return;
    }

    this.isProd = true;
  }
}
