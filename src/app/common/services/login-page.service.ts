import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginPageService {
  private readonly _user$ = new BehaviorSubject<SocialUser>(null);

  readonly user$ = this._user$.asObservable();

  constructor(
    private authService: SocialAuthService
  ) {

    this.authService.authState.subscribe((user) => {
      if (user) {
        this._user$.next(user);
      }
    });
  }

  signOut(): Observable<void> {
    try {
      localStorage.removeItem('user');
      return from(this.authService.signOut());
    } catch (e) {
      console.log("Not signed to google");
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
