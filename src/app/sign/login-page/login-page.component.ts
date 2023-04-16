import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/common/services/modal/modal.service';
import { LoginService } from '../../common/services/login-service/login.service';
import { NotificationsService } from '../../common/services/notifications/notifications.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent implements OnInit { 
  @Output()
  switchMode: EventEmitter<void> = new EventEmitter<void>();

  form = new FormGroup({
    login: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>(null, [Validators.required]),
  });

  passwordVisible: boolean = false;
  isLoading: boolean = false;

  constructor(
    private loginService: LoginService,
    private notificationService: NotificationsService,
    private modalService: ModalService,
    private router: Router,
    ) {}

  ngOnInit(): void {
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  signIn(): void {
    if(this.validateForm()) {
      this.isLoading = true;
      this.loginService.signIn(this.form.controls.login.value, this.form.controls.password.value).subscribe(
        () => {
        this.notificationService.success('Pomyślnie zalogowano uzytkownika', '');
        this.modalService.close();
        this.router.navigate(['/your-activities']);
        this.isLoading = false;
      },
      (error) => {
        const errorMessage = JSON.parse(error.error);
        this.form.controls['login'].setErrors({ invalidLogin: errorMessage.message });
        this.notificationService.error('Logowanie', errorMessage.message);
        this.isLoading = false;
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
