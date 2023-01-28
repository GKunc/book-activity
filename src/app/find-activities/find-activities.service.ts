import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FindActivitiesService {
  constructor(private http: HttpClient) { }

  getActivities(): void {
    this.http.get(environment.apiUrl + '/activities').subscribe(
      (result => {
        console.log("RESULT: ", result)
      })
    )
  }
}