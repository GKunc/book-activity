import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseResponse } from '../../models/http-base-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  signUp(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      '/api/auth/signup',
      {
        username,
        email,
        password,
        roles: ['user'],
      },
      { responseType: 'text' }
    );
  }

  refreshToken(username: string): Observable<any> {
    return this.http.get(`/api/auth/refresh?username=${username}`);
  }

  getUser(userId: string): Observable<any> {
    return this.http.get(`/api/auth/getUser?userId=${userId}`);
  }

  signIn(username: string, password: string, googleLogIn: boolean = false): Observable<any> {
    return this.http.post(
      '/api/auth/signin',
      {
        username,
        password,
        googleLogIn,
      },
      { responseType: 'text' }
    );
  }

  signOut(): void {
    this.http.post('/api/auth/signout', {});
  }

  confirmEmail(confirmationSecret: string, userId: string): Observable<HttpBaseResponse> {
    return this.http.post<HttpBaseResponse>('/api/auth/confirmEmail', {
      confirmationSecret,
      userId,
    });
  }
}
