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

  constructor(
    public loginService: LoginService,
    private modalService: ModalService,
  ) {
  }

  ngOnInit(): void {
    this.loginService.user$?.subscribe(data => {
      this.user = data;
    })
  }

  signOut(): void {
    this.loginService.signOut();
  }

  openAddActivityScreen(): void {
    this.modalService.createModal(AddActivityComponent, 'Dodaj swoje zajęcia', "Wyślij");
  }

  openLoginScreen(): void {
    this.modalService.createModal(LoginPageComponent, 'Login');
  }
}
