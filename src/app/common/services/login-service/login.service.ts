import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly _user$ = new BehaviorSubject<SocialUser>(null);

  readonly user$ = this._user$.asObservable();

  constructor(
    private authService: SocialAuthService
  ) {

    this.authService.authState.subscribe((user) => {
      console.log(user);

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

  get user(): SocialUser | undefined {
    return this._user$.getValue();
  }

  private set user(value: SocialUser | undefined) {
    this._user$.next(value);
  }
}
