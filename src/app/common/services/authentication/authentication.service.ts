import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from '../../models/http-base-response.model';
import { InternalUser } from '../login-service/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  verifyToken(): Observable<any> {
    return this.http.post('/api/auth/verifyToken', {}, { responseType: 'text' });
  }

  signUp(username: string, email: string, password: string): Observable<{ userId: string }> {
    return this.http.post<{ userId: string }>('/api/auth/signup', {
      username,
      email,
      password,
      roles: ['user'],
    });
  }

  resetPassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>('/api/auth/password', {
      email,
      oldPassword,
      newPassword,
    });
  }

  refreshToken(username: string): Observable<any> {
    return this.http.get(`/api/auth/refresh?username=${username}`);
  }

  getUser(userId: string): Observable<InternalUser> {
    return this.http.get<InternalUser>(`/api/user?userId=${userId}`);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>('/api/user', { body: { userId } });
  }

  signIn(username: string, password: string, googleLogIn: boolean = false): Observable<HttpBaseResponse> {
    return this.http.post<HttpBaseResponse>('/api/auth/signin', {
      username,
      password,
      googleLogIn,
    });
  }

  signOut(): Observable<HttpBaseResponse> {
    return this.http.post<HttpBaseResponse>('/api/auth/signout', {});
  }
}
