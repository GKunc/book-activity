import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ResizeService } from 'src/app/common/services/resize/resize.service';
import { LoginService } from '../../common/services/login-service/login.service';
import { NotificationsService } from '../../common/services/notifications/notifications.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less'],
})
export class LoginPageComponent implements OnInit {
  form = new FormGroup({
    login: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>(null, [Validators.required]),
  });

  passwordVisible: boolean = false;
  isLoading: boolean = false;

  constructor(
    private loginService: LoginService,
    private notificationService: NotificationsService,
    private router: Router,
    public resizeService: ResizeService
  ) {}

  ngOnInit(): void {
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  signIn(): void {
    if (this.validateForm()) {
      this.isLoading = true;
      this.loginService
        .signIn(this.form.controls.login.value, this.form.controls.password.value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          () => {
            this.notificationService.success('Pomyślnie zalogowano uzytkownika', '');
            this.router.navigate(['/profile']);
          },
          (e) => {
            this.form.controls['login'].setErrors({ invalidLogin: e });
            this.notificationService.error('Logowanie', e);
          }
        );
    }
  }
  private validateForm(): boolean {
    if (!this.form.valid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return true;
    }
    return true;
  }
}
