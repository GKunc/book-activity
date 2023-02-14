import { SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { AddActivityComponent } from 'src/app/add-activity/add-activity.component';
import { LoginService } from 'src/app/common/services/login-service/login.service';
import { ModalService } from 'src/app/common/services/modal/modal.service';
import { LoginPageComponent } from 'src/app/login-page/login-page.component';

@Component({
  selector: 'hub-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {

  user: SocialUser | undefined;
  userInitials: string;

  constructor(
    public loginService: LoginService,
    private modalService: ModalService,
  ) {
  }

  ngOnInit(): void {
    this.loginService.user$?.subscribe(data => {
      if (data) {
        this.user = data;
        const userNameSplitted = this.user?.name.split(' ');
        this.userInitials = userNameSplitted[0].charAt(0).toUpperCase() + userNameSplitted[1].charAt(0).toUpperCase()
        this.modalService.close();
      }
    })
  }

  signOut(): void {
    this.loginService.signOut();
  }

  openAddActivityScreen(): void {
    this.modalService.createModal(AddActivityComponent, 'Dodaj swoje zajęcia', 500, "Wyślij");
  }

  openLoginScreen(): void {
    this.modalService.createModal(LoginPageComponent, 'Login', 440);
  }
}
