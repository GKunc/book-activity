import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
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

  insertActivity(activity: Activity): Observable<any> {
    return this.http.post('/api/activities', activity, { responseType: 'text' });
  }

  insertPhoto(fileList: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    })
    return this.http.post('/api/activities/photos', fileList, { headers, responseType: 'text' });
  }

  editActivity(): void {
    this.http.patch('/api/activities', {}).subscribe();
  }
}

export interface Activity {
  guid: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  time: string;
  weekDay: WeekDay;
  street: string;
  city: string;
  email: string;
  phone: string;
  facebook?: string;
  instagram?: string;
  www?: string;
}
