import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../common/services/login-service/login.service';
import { NotificationsService } from '../common/services/notifications/notifications.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent { 
  
  form = new FormGroup({
    login: new FormControl<string>('', Validators.required),
    email: new FormControl<string>(null, Validators.required),
    password: new FormControl<string>(null, Validators.required),
  });

  passwordVisible: boolean = false;
  
  constructor(
    private loginService: LoginService,
    private notificationService: NotificationsService
    ) {}

  signIn(): void {
    this.loginService.signIn(this.form.controls.login.value, this.form.controls.password.value).subscribe((response) => {
      this.notificationService.success('Logowanie', response.message);
    });
  }

  signUp(): void {
    this.loginService.signUp(this.form.controls.login.value, this.form.controls.email.value, this.form.controls.password.value).subscribe((response) => {
      this.notificationService.success('Rejestracja', response.message);
    });  
  }
}
