import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LoginService } from '../../services/login-service/login.service';
import { ModalService } from '../../services/modal/modal.service';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../consts/local-storage.consts';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private authService: AuthenticationService;
  private modalService: ModalService;
  private loginService: LoginService;
  private localStorageService: LocalStorageService;

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(AuthenticationService);
    this.modalService = this.injector.get(ModalService);
    this.loginService = this.injector.get(LoginService);
    this.localStorageService = this.injector.get(LocalStorageService);

    req = req.clone({
      withCredentials: true,
    });

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 403) {
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
        return this.authService.refreshToken(this.loginService.user.username).pipe(
          switchMap(({ access_token }) => {
            this.localStorageService.setItem(ACCESS_TOKEN, access_token);
            this.isRefreshing = false;
            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            if (error.status == '403') {
              this.localStorageService.removeItem(ACCESS_TOKEN);
              this.localStorageService.removeItem(REFRESH_TOKEN);
              this.loginService.signOut();
              this.modalService.closeAll();
              return;
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }
}
