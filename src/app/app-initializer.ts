import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, map, mergeMap, Observable, of, take } from 'rxjs';
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
    return this.configReady$.pipe(
      filter((_) => _),
      mergeMap(() => this.authService.refreshToken(this.loginService.user.username)),
      map(() => true),
      catchError(() => {
        return of<boolean>(false);
      }),
      take(1)
    );
  }
}
