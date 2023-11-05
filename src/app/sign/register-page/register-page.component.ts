import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/common/services/authentication/authentication.service';
import { LoginService } from 'src/app/common/services/login-service/login.service';
import { ResizeService } from 'src/app/common/services/resize/resize.service';
import { hasLowerCase, hasNumber, hasUpperCase } from '../../common/validators/strong-password.validator';

@Component({
  selector: 'register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.less'],
})
export class RegisterPageComponent {
  @Output()
  switchMode: EventEmitter<void> = new EventEmitter<void>();

  form = new FormGroup({
    login: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl<string>(null, [Validators.required, Validators.email]),
    password: new FormControl<string>(null, [
      Validators.required,
      Validators.minLength(8),
      hasLowerCase(),
      hasUpperCase(),
      hasNumber(),
    ]),
  });

  passwordVisible: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private loginService: LoginService,
    public resizeService: ResizeService
  ) {}

  signUp(): void {
    if (this.validateForm()) {
      this.isLoading = true;
      this.authService
        .signUp(this.form.controls.login.value, this.form.controls.email.value, this.form.controls.password.value)
        .subscribe(
          () => {
            this.loginService
              .signIn(this.form.controls.login.value, this.form.controls.password.value)
              .subscribe(() => {
                console.log('Signin');
                this.isLoading = false;
                this.router.navigate(['packages']);
              });
          },
          (error) => {
            this.isLoading = false;
            const errorMessage = JSON.parse(error.error);
            this.form.controls[errorMessage.field].setErrors({ [errorMessage.errorType]: errorMessage.message });
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
      return false;
    }
    return true;
  }
}
