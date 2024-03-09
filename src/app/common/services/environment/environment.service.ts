import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  isProd: boolean = true;

  localStorageService: LocalStorageService = inject(LocalStorageService);

  checkEnvironment() {
    console.log(
      'this.localStorageService.getItem(environment.ADMIN_TOKEN)',
      this.localStorageService.getItem(environment.ADMIN_TOKEN)
    );
    if (
      window.location.href.includes('localhost') &&
      this.localStorageService.getItem(environment.ADMIN_TOKEN) !== null
    ) {
      this.isProd = false;
      return;
    }

    this.isProd = true;
  }
}
