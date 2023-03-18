import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly _user$ = new ReplaySubject<SocialUser>(null);
  loogedUser: SocialUser = null;

  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
  ) {

    this.authService.authState.subscribe((user) => {
      this.loogedUser = user;
      // add JWT token
      this._user$.next(user);
    });
  }

  signUp(username: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/auth/signup', {
      username,
      email,
      password,
      roles: ["user"],
    }, {responseType: "text"});
  }

  signIn(username: string, password: string): Observable<any> {
    return this.http.post('/api/auth/signin', {
      username,
      password,
    }, {responseType: "text"});
  } 

  signOut(): Observable<void> {
    try {
      this.http.post('/api/auth/signout', {}).subscribe(() => { return; });
      return from(this.authService.signOut());
    } catch (e) {
      return of(null);
    }
  }

  get user(): SocialUser {
    return this.loogedUser;
  }
}
