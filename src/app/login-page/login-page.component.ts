import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../common/services/login-service/login.service';
import { NotificationsService } from '../common/services/notifications/notifications.service';
import { hasLowerCase, hasNumber, hasUpperCase } from '../common/validators/strong-password.validator';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent { 
  @ViewChild('googleSingInButton')
  signWithGoogle: ElementRef;

  @ViewChild('loginInputField')
  loginInput: ElementRef;
  

  showLoginTemplate: boolean = true;

  form = new FormGroup({
    login: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl<string>(null, [Validators.required, Validators.email]),
    password: new FormControl<string>(null, [Validators.required, Validators.minLength(8), hasLowerCase(), hasUpperCase(), hasNumber()]),
  });

  passwordVisible: boolean = false;
  
  constructor(
    private loginService: LoginService,
    private notificationService: NotificationsService
    ) {}

  signIn(): void {
    if(this.validateForm) {
      this.loginService.signIn(this.form.controls.login.value, this.form.controls.password.value).subscribe((response) => {
        this.notificationService.success('Logowanie', response.message);
      });
    }
  }

  signUp(): void {
    if(this.validateForm) {
      this.loginService.signUp(this.form.controls.login.value, this.form.controls.email.value, this.form.controls.password.value).subscribe((response) => {
        this.notificationService.success('Rejestracja', response.message);
      });  
    }
  }

  private validateForm(): boolean {
    if (!this.form.valid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    }
    return true;
  }
}
