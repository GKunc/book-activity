import { SocialUser } from '@abacritt/angularx-social-login';
import { WeekDay } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WEEK_DAYS } from 'src/app/add-activity/week-days.consts';
import { LoginService } from 'src/app/common/services/login-service/login.service';
import { ModalService } from 'src/app/common/services/modal/modal.service';
import { ResizeService } from 'src/app/common/services/resize/resize.service';
import { LoginPageComponent } from 'src/app/sign/login-page/login-page.component';
import { SignComponent } from 'src/app/sign/sign.component';

@Component({
  selector: 'hub-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {
  visible = false;

  user: SocialUser | undefined;
  userInitials: string;
  weekDay: WeekDay[];

  weekDaysOptions: { value: WeekDay, label: string }[] = WEEK_DAYS;

  phrase = '';
  weekDays: WeekDay[] = [];

  constructor(
    public loginService: LoginService,
    public resizeService: ResizeService,
    private modalService: ModalService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.loginService._user$?.subscribe(data => {
      if (data) {
        this.user = data;
        const userNameSplitted = this.user?.name.split(' ');
        this.userInitials = userNameSplitted[0].charAt(0).toUpperCase() + userNameSplitted[1].charAt(0).toUpperCase()
        this.modalService.close();
      }
    })
  }

  searchActivities(): void {
    this.router.navigate(['find-activities', { phrase: this.phrase, weekDays: this.weekDays }]);
  }

  signOut(): void {
    this.loginService.signOut();
  }

  openLoginScreen(): void {
    this.modalService.createModal(SignComponent, 'Login', 440);
  }

  openMobileMenu(): void {
    this.visible = true;
  }

  closeMobileMenu(): void {
    this.visible = false;
  }
}
