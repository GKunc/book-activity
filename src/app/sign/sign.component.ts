import { Component } from '@angular/core';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.less']
})
export class SignComponent {
  showLogin: boolean = true;

  onSwitchMode(): void {
    this.showLogin = !this.showLogin;
  }
}
