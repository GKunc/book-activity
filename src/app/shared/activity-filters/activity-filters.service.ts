import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ActivityFilters } from './activity-filters.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityFiltersService {
  _filters$ = new ReplaySubject<ActivityFilters>(null);

  setFilters(filters: ActivityFilters) {
    this._filters$.next(filters);
  }

  getFilters(): Observable<ActivityFilters> {
    return this._filters$.asObservable();
  }
}
