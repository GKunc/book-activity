import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../common/services/login-service/login.service';
import { NotificationsService } from '../../common/services/notifications/notifications.service';
import { hasLowerCase, hasNumber, hasUpperCase } from '../../common/validators/strong-password.validator';

@Component({
  selector: 'register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.less']
})
export class RegisterPageComponent {
  @Output()
  switchMode: EventEmitter<void> = new EventEmitter<void>();

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
    
  signUp(): void {
    if(this.validateForm()) {
      this.loginService.signUp(this.form.controls.login.value, this.form.controls.email.value, this.form.controls.password.value).subscribe((response) => {
        this.notificationService.success('Rejestracja', response.message);
        // close modal
      },
      (error) => {
        const errorMessage = JSON.parse(error.error);
        this.form.controls[errorMessage.field].setErrors({ [errorMessage.errorType]: errorMessage.message });
        this.notificationService.error('Rejestracja', errorMessage.message);
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
      return true;
    }
    return true;
  }
}
