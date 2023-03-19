import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  
  constructor(
    private loginService: LoginService,
    private notificationService: NotificationsService,
    private modalService: ModalService,
    ) {}

  ngOnInit(): void {
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  signIn(): void {
    if(this.validateForm()) {
      this.loginService.signIn(this.form.controls.login.value, this.form.controls.password.value).subscribe(
        (response) => {
        this.notificationService.success('Pomyślnie zalogowano uzytkownika', '');
        this.loginService.loggedUser = JSON.parse(response);
        this.loginService._user$.next(JSON.parse(response));
        this.modalService.close();
      },
      (error) => {
        const errorMessage = JSON.parse(error.error);
        this.form.controls['login'].setErrors({ invalidLogin: errorMessage.message });
        this.notificationService.error('Logowanie', errorMessage.message);
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
