import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { LoginPageService } from 'src/app/common/services/login-page.service';

@Component({
  selector: 'hub-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {

  user: SocialUser | undefined;

  constructor(
    public loginService: LoginPageService
  ) {
  }

  ngOnInit(): void {
    this.loginService.user$?.subscribe(data => {
      console.log("U", data)
      this.user = data;
    })
  }

  async signOut(): Promise<void> {
    // await this.authService.signOut();
    console.log("LOGGED OUT")
  }

}
