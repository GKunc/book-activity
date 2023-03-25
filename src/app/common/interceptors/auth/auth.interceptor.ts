import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';


import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ACCESS_TOKEN, LoginService } from '../../services/login-service/login.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private loginService: LoginService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 403
        ) {
          return this.handle403Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.loginService.user) {
        return this.loginService.refreshToken(this.loginService.user.username).pipe(
          switchMap((result) => {
            localStorage.setItem(ACCESS_TOKEN, result);
            this.isRefreshing = false;
            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            if (error.status == '403') {
              this.loginService.signOut();
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }
}