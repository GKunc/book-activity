import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Details } from 'src/app/add-activity/activity-data-form/activity-data-form.component';
import { GroupDetails } from 'src/app/add-activity/activity-groups-form/activity-groups-form.component';
import { Category } from 'src/app/add-activity/category.consts';
import { WeekDay } from 'src/app/add-activity/week-days.consts';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private http: HttpClient) { }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>('/api/activities');
  }

  getActivityDetails(id: string): Observable<Activity> {
    return this.http.get<Activity>('/api/activities/detail?id=' + id);
  }

  filterActivities(query: Partial<FilterActivitiesParams>): Observable<any> {
    return this.http.post<Activity[]>('/api/filter-activities', query);
    // {
    //   phrase: 'phrase',
    //   day: 0,
    //   category: '1',
    //   minPrice: 10,
    //   maxPrice: 100,
    // }
  }

  insertActivity(activity: Activity): Observable<any> {
    return this.http.post('/api/activities', activity, { responseType: 'text' });
  }

  insertPhoto(fileList: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    })
    return this.http.post('/api/activities/photos', fileList, { headers, responseType: 'text' });
  }

  getPhoto(id: string): any {
    return this.http.get(`/api/activities/photos?id=${id}`, { responseType: 'blob' });
  }

  editActivity(): void {
    this.http.patch('/api/activities', {}).subscribe();
  }
}

export interface Activity {
  guid: string;
  createdBy: string;
  nubmerOfImages: number;
  name: string;
  category: Category;
  description: string;
  groups: GroupDetails[];
  street: string;
  city: string;
  googleMapsSrc: string;
  email: string;
  phone: string;
  facebook?: string;
  instagram?: string;
  www?: string;
}

export interface FilterActivitiesParams {
  phrase: string,
  weekDay: WeekDay,
  category: Category,
  minPrice: number,
  maxPrice: number,
}
