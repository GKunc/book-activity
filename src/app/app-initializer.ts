import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { AuthenticationService } from './common/services/authentication/authentication.service';
import { LoginService } from './common/services/login-service/login.service';

export function appInitializerFactory(appInitializerService: AppInitializer): () => Observable<boolean> {
  return (): Observable<boolean> => appInitializerService?.load();
}

@Injectable({
  providedIn: 'root',
})
export class AppInitializer {
  configReady: Observable<boolean>;
  private configReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private authService: AuthenticationService, private loginService: LoginService) {
    this.configReady = this.configReady$.asObservable();
  }

  load(): Observable<boolean> {
    console.log('APP_INITIALIZER');
    return this.configReady$.pipe(
      filter((_) => _),
      mergeMap(() => this.authService.refreshToken(this.loginService.user.username)),
      map(() => true),
      catchError((e) => {
        return of<boolean>(false);
      }),
      take(1)
    );
  }
}
