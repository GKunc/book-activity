import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.less'],
})
export class NotAuthorizedComponent {
  constructor(private router: Router) {}

  openLoginModal(): void {
    this.router.navigate(['sign']);
  }
}
