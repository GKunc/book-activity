import { WeekDay } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WEEK_DAYS } from 'src/app/add-activity/week-days.consts';
import { InternalUser, LoginService } from 'src/app/common/services/login-service/login.service';
import { ModalService } from 'src/app/common/services/modal/modal.service';
import { ResizeService } from 'src/app/common/services/resize/resize.service';
import { SignComponent } from 'src/app/sign/sign.component';

@Component({
  selector: 'hub-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {
  visible = false;

  user: InternalUser;
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
      console.log("INITIALS", data);
      
      if (data) {
        this.user = data;
        console.log("INITIALS", this.userInitials);
        console.log("INITIALS", this.user.username);
        this.userInitials = this.user.username.charAt(0).toUpperCase();

        
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
