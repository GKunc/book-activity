import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthenticationService } from '../common/services/authentication/authentication.service';
import { NotificationsService } from '../common/services/notifications/notifications.service';
import CustomValidators from '../common/validators/strong-password.validator';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less'],
  standalone: true,
  imports: [SharedModule, NgIf, AsyncPipe],
})
export class ResetPasswordComponent implements OnInit {
  form = new FormGroup(
    {
      email: new FormControl<string>(null, [
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      oldPassword: new FormControl<string>('', [Validators.required]),
      newPassword: new FormControl<string>('', [Validators.required]),
      newPasswordMatch: new FormControl<string>('', [Validators.required]),
    },
    {
      validators: [CustomValidators.match('password', 'passwordConfirm')],
    }
  );

  passwordVisible: boolean = false;
  isLoading: boolean = false;

  constructor(
    private notificationService: NotificationsService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  resetPassword(): void {
    if (this.validateForm()) {
      this.isLoading = true;
      this.authService
        .resetPassword(
          this.form.controls.email.value,
          this.form.controls.oldPassword.value,
          this.form.controls.newPassword.value
        )
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          () => {
            this.notificationService.success('Pomyślnie zresetowano haslo', '');
            this.router.navigate(['/sign']);
          },
          (e) => {
            this.form.controls['login'].setErrors({ invalidLogin: e });
            this.notificationService.error('Resetowanie hasła nie powiodło się', null);
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
