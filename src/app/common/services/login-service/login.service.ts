import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { BehaviorSubject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly _user$ = new ReplaySubject<SocialUser>(null);

  loogedUser: SocialUser = null;

  constructor(
    private authService: SocialAuthService
  ) {

    this.authService.authState.subscribe((user) => {
      this.loogedUser = user;
      this._user$.next(user);
    });
  }

  signOut(): Observable<void> {
    try {
      return from(this.authService.signOut());
    } catch (e) {
      return of(null);
    }
  }

  get user(): SocialUser {
    return this.loogedUser;
  }
}
