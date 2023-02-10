import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private http: HttpClient) { }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>('/api/activities');
  }

  insertActivity(activity: Activity): void {
    this.http.post<Activity>('/api/activities', activity).subscribe();
  }

  editActivity(): void {
    this.http.patch('/api/activities', {}).subscribe();
  }
}

export interface Activity {
  id: number;
  name: string;
  email: string;
  phone: string;
  time: string;
}
