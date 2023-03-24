import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, tap } from 'rxjs';
import { from } from 'rxjs';

export const AUTH_TOKEN = 'AUTH_TOKEN';

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

    if(localStorage.getItem(AUTH_TOKEN)) {
      const loggedUser: InternalUser = JSON.parse(localStorage.getItem(AUTH_TOKEN));
      this.loggedUser = {id: loggedUser.id, username: loggedUser.username, email: loggedUser.email};
      this._user$.next(this.loggedUser);
    }
    else {
      this.authService.authState.subscribe((user) => {
        if(user) {
          this.loggedUser = { id: user.id, username: user.name, email: user.email };
          this.signUp(this.user.username, this.user.email, '').subscribe(
            () => of(null),
            () => of(null));

          this.signIn(this.user.username, '', true).subscribe();
          this._user$.next(this.loggedUser);
        }
      },
      (error) => {
        console.log("LOGIN ERROR", error)
      });
    }
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
    }, {responseType: "text"}).pipe(tap(user => {
      localStorage.setItem(AUTH_TOKEN, user);
    }));
  } 

  signOut(): Observable<void> {
    try {
      this.http.post('/api/auth/signout', {}).subscribe();
      this._user$.next(null);
      return from(this.authService.signOut());
    } catch (e) {
      return of(null);
    } finally {
      localStorage.removeItem(AUTH_TOKEN);
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