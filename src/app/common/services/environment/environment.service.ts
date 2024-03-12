import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADMIN_TOKEN } from '../../consts/local-storage.consts';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AppConfig } from './environment.model';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  isProd: boolean = true;

  localStorageService: LocalStorageService = inject(LocalStorageService);
  http: HttpClient = inject(HttpClient);

  checkEnvironment(): void {
    const params = new HttpParams().append('adminToken', this.localStorageService.getItem(ADMIN_TOKEN));
    this.http.get<AppConfig>('/api/environment/config', { params }).subscribe((config) => {
      this.isProd = config.isProd;
    });
  }
}
