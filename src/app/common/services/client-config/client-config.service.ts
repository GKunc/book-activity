import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ActivityFilters } from 'src/app/shared/activity-filters/activity-filters.model';
import { ACTIVITY_FILTERS } from '../../consts/local-storage.consts';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { LoginService } from '../login-service/login.service';

@Injectable({
  providedIn: 'root',
})
export class ClienntConfigService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private loginService: LoginService
  ) {}

  getUserConfig(): Observable<ActivityFilters> {
    let params = new HttpParams();
    params = params.append('userId', this.loginService.loggedUser?.id);
    return this.http.get<ActivityFilters>('/api/settings', { params });
  }

  setConfig(filters: ActivityFilters): Observable<void> {
    this.localStorageService.setItem(ACTIVITY_FILTERS, filters);
    const userId = this.loginService.loggedUser?.id;
    return this.http.put<void>('/api/settings', { userId, filters }).pipe(catchError(() => of(null)));
  }
}
