import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginPageService {
  private readonly _user$ = new BehaviorSubject<SocialUser | undefined>(undefined);

  readonly user$ = this._user$.asObservable();

  constructor(
    private authService: SocialAuthService
  ) {

    this.authService.authState.subscribe((user) => {
      this._user$.next(user);
    });
  }

  get user(): SocialUser | undefined {
    return this._user$.getValue();
  }

  private set user(value: SocialUser | undefined) {
    this._user$.next(value);
  }
}
