import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take } from 'rxjs';
import { AuthenticationService } from './common/services/authentication/authentication.service';

export function appInitializerFactory(appInitializerService: AppInitializer): () => Observable<boolean> {
  return (): Observable<boolean> => appInitializerService?.load();
}

@Injectable({
  providedIn: 'root',
})
export class AppInitializer {
  configReady: Observable<boolean>;
  private configReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private authService: AuthenticationService) {
    this.configReady = this.configReady$.asObservable();
  }

  load(): Observable<boolean> {
    console.log('APP_INITIALIZER');
    return this.configReady$.pipe(
      filter((_) => _),
      switchMap(() => this.authService.verifyToken()),
      map(() => true),
      catchError(() => {
        return of<boolean>(false);
      }),
      take(1)
    );
  }
}
