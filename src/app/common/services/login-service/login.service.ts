import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, tap } from 'rxjs';
import { from } from 'rxjs';
import jwt_decode from 'jwt-decode';

export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';

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
    
    const token = localStorage.getItem(ACCESS_TOKEN);
    if(token) {
      const loggedUser: InternalUser = jwt_decode(token);
      this.loggedUser = {id: loggedUser.id, username: loggedUser.username, email: loggedUser.email};
      this._user$.next(this.loggedUser);
    } else {
      this.authService.authState.subscribe(
        (user) => {        
          if(user) {
            this.signUp(user.name, user.email, '').subscribe(
              () => of(null),
              () => of(null),
            );

            this.signIn(user.name, '', true).subscribe();
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

  refreshToken(username: string): Observable<any> {
    return this.http.get(`/api/auth/refresh?username=${username}`);
  }

  signIn(username: string, password: string, googleLogIn: boolean = false): Observable<any> {
    return this.http.post('/api/auth/signin', {
      username,
      password,
      googleLogIn,
    }, {responseType: "text"}).pipe(
      tap(result => {        
        const { access_token, refresh_token } = JSON.parse(result);
        localStorage.setItem(ACCESS_TOKEN, access_token);
        localStorage.setItem(REFRESH_TOKEN, refresh_token);

        const loggedUser: InternalUser = jwt_decode(access_token);
        console.log("SIGNIN RESULT", loggedUser);
        this.loggedUser = loggedUser;
        this._user$.next(loggedUser);
      })
    );
  } 

  signOut(): void {
    try {
      this.http.post('/api/auth/signout', {}).subscribe();
      this.loggedUser = null;
      this._user$.next(null);
      from(this.authService.signOut()).subscribe(
        () => of(null),
        () => of(null));
    } catch (e) {
      console.log("Error", e)
    } finally {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
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