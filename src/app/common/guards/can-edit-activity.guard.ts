import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ActivitiesService } from '../services/activities/activities.service';
import { LoginService } from '../services/login-service/login.service';

@Injectable({
  providedIn: 'root',
})
export class CanEditActivityGuard {
  constructor(
    private loginService: LoginService,
    private activitiesService: ActivitiesService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const guid = route.params['id'];
    const userId = this.loginService.loggedUser?.id;
    return this.activitiesService.checkPermission(guid, userId).pipe(
      map((response) => {
        if (response.status === 200) {
          return true;
        } else {
          this.router.navigate(['/not-authorized']);
          return false;
        }
      })
    );
  }
}
