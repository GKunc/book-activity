import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityFilters } from 'src/app/shared/activity-filters/activity-filters.model';
import { Activity } from './activities.model';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  constructor(private http: HttpClient) {}

  getUserActivities(id: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`/api/activities/${id}`);
  }

  filterActivities(query: Partial<ActivityFilters>): Observable<any> {
    return this.http.post<Activity[]>('/api/activities/filter', query);
  }

  checkPermission(guid: string, userId: string): Observable<any> {
    return this.http.get(`/api/activities/check-permissions?guid=${guid}&userId=${userId}`, {
      responseType: 'text',
      observe: 'response',
    });
  }

  getActivityDetails(id: string): Observable<Activity> {
    return this.http.get<Activity>(`/api/activities/details?id=${id}`);
  }

  insertActivity(activity: Activity): Observable<any> {
    return this.http.post('/api/activities', activity, { responseType: 'text' });
  }

  insertPhoto(fileList: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.http.post('/api/activities/photos', fileList, { headers, responseType: 'text' });
  }

  deletePhoto(id: string): any {
    return this.http.delete(`/api/activities/photos?id=${id}`);
  }

  getPhoto(id: string): any {
    return this.http.get(`/api/activities/photos?id=${id}`, { responseType: 'blob' });
  }

  deleteActivity(id: string): Observable<any> {
    return this.http.delete(`/api/activities?id=${id}`, { responseType: 'text' });
  }

  editActivity(activity: Partial<Activity>): Observable<any> {
    return this.http.put(`/api/activities?id=${activity.guid}`, activity, { responseType: 'text' });
  }
}
