import { Injectable } from '@angular/core';
import { catchError, Observable, of, ReplaySubject, tap, throwError } from 'rxjs';
import { from } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { ACCESS_TOKEN, FAVOURITES, REFRESH_TOKEN } from '../../consts/local-storage.consts';
import { FavouriteService } from '../favourites/favourites.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Favourite } from '../favourites/favourites.model';
import { Package } from 'src/app/profile/profile.models';
import { HttpBaseResponse } from '../../models/http-base-response.model';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  _user$ = new ReplaySubject<InternalUser>(null);
  _favourites$ = new ReplaySubject<string[]>(null);
  loggedUser: InternalUser = null;

  constructor(
    private favouriteService: FavouriteService,
    private authService: AuthenticationService,
    private localStorageService: LocalStorageService
  ) {
    const token = this.localStorageService.getItem<string>(ACCESS_TOKEN);
    if (token) {
      const loggedUser: InternalUser = jwt_decode(token);
      this.loggedUser = {
        id: loggedUser.id,
        username: loggedUser.username,
        email: loggedUser.email,
        createdAt: loggedUser.createdAt,
        package: loggedUser.package,
        paymentEndDate: loggedUser.paymentEndDate,
        isTrail: loggedUser.isTrail,
      };
      this._user$.next(this.loggedUser);
    }
  }

  signIn(username: string, password: string, googleLogIn: boolean = false): Observable<HttpBaseResponse> {
    return this.authService.signIn(username, password, googleLogIn).pipe(
      tap((result) => {
        if (result.data) {
          const { access_token, refresh_token } = result.data;
          this.localStorageService.setItem(ACCESS_TOKEN, access_token);
          this.localStorageService.setItem(REFRESH_TOKEN, refresh_token);

          const loggedUser: InternalUser = jwt_decode(access_token);
          this.loggedUser = loggedUser;
          this._user$.next(loggedUser);
          // get favourites
          this.favouriteService.getFavourites(loggedUser?.id).subscribe((response: Favourite) => {
            if (response.favourites.length > 0) {
              this.localStorageService.setItem(FAVOURITES, response?.favourites);
              this._favourites$.next(response?.favourites);
            }
          });
        }
      }),
      catchError((e) => {
        if (e.status === 401) {
          return throwError(e.error.message);
        }
        return of(e);
      })
    );
  }

  signOut(): void {
    try {
      this.authService.signOut().subscribe((response) => {
        if (response?.isSuccess) {
          throw new Error(response?.message);
        }
      });
      this.loggedUser = null;
      this._user$.next(null);
    } catch (e) {
      console.log('Error', e);
    } finally {
      this.localStorageService.removeItem(ACCESS_TOKEN);
      this.localStorageService.removeItem(REFRESH_TOKEN);
      this.localStorageService.removeItem(FAVOURITES);
    }
  }

  getUser(userId: string): Observable<InternalUser> {
    return this.authService.getUser(userId);
  }

  get user(): InternalUser {
    return this.loggedUser;
  }
}

export interface InternalUser {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  package: Package;
  paymentEndDate: Date;
  isTrail: boolean;
}
