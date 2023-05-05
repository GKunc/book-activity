import { Component, OnInit } from '@angular/core';
import { LoginService } from '../common/services/login-service/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent implements OnInit {
  loading: boolean;
  error: boolean;
  userLogged = false;

  constructor(public loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService._user$.subscribe((user) => {
      if (user) {
        this.userLogged = true;
      } else {
        this.userLogged = false;
      }
    });
  }
}
