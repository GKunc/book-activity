import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  isProd: boolean = true;

  checkEnvironment() {
    if (window.location.href.includes('localhost')) {
      this.isProd = false;
      return;
    }

    this.isProd = true;
  }
}
