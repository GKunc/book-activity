import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  _user$ = new ReplaySubject<InternalUser>(null);
  loggedUser: InternalUser = null;

  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
  ) {

    this.authService.authState.subscribe((user) => {
      this.loggedUser = { id: user.id, username: user.name, email: user.email };
      this.signUp(this.user.username, this.user.email, '').subscribe();
      this.signIn(this.user.username, '', true).subscribe();
      this._user$.next(this.loggedUser);
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

  signIn(username: string, password: string, googleLogIn: boolean = false): Observable<any> {
    return this.http.post('/api/auth/signin', {
      username,
      password,
      googleLogIn,
    }, {responseType: "text"});
  } 

  signOut(): Observable<void> {
    try {
      this.http.post('/api/auth/signout', {}).subscribe();
      this._user$.next(null);
      return from(this.authService.signOut());
    } catch (e) {
      return of(null);
    }
  }

  get user(): InternalUser {
    return this.loggedUser;
  }
}


export interface InternalUser {
  id: string;
  username: string;
  email: string;
}