import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupDetails } from '../activities/activities.model';
import { InternalUser } from '../login-service/login.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getEnrolledGroups(user: InternalUser): Observable<GroupDetails[]> {
    return this.http.get<GroupDetails[]>(`/api/user/enroll/${user.id}`);
  }

  enrollForGroup(user: InternalUser, group: GroupDetails): Observable<void> {
    return this.http.put<void>(`/api/user/enroll/${user.id}`, { groupId: group._id });
  }

  deleteEnrolledGroup(user: InternalUser, group: GroupDetails): Observable<void> {
    const params = new HttpParams().append('groupId', group._id);
    return this.http.delete<void>(`/api/user/enroll/${user.id}`, { params });
  }
}
