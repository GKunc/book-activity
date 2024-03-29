import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../common/services/authentication/authentication.service';
import { LoginService } from '../common/services/login-service/login.service';
import { ModalService } from '../common/services/modal/modal.service';
import { PackagesComponent } from '../packages/packages.component';
import { Package, PACKAGES, ProfileForm } from './settings.models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class SettingsComponent implements OnInit {
  loading: boolean;
  error: boolean;
  userLogged = false;

  notifications = false;

  form = new FormGroup({
    userName: new FormControl<string>({ value: null, disabled: true }),
    email: new FormControl<string>({ value: null, disabled: true }),
    createdAt: new FormControl<string>({ value: null, disabled: true }),
    notificationsEnabled: new FormControl<boolean>({ value: true, disabled: true }),
    paymentEndDate: new FormControl<string>({ value: null, disabled: true }),
    currentPackage: new FormControl<Package>({ value: null, disabled: true }),
    isTrail: new FormControl<boolean>({ value: null, disabled: true }),
    trailEndDate: new FormControl<string>({ value: null, disabled: true }),
  });

  packagesOptions = PACKAGES;
  initialForm: ProfileForm = null;

  constructor(
    public loginService: LoginService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userLogged = !!this.loginService.user;
    if (this.userLogged) {
      this.loginService.getUser(this.loginService.user.id).subscribe((user) => {
        if (user) {
          this.userLogged = true;
          this.form.controls.userName.setValue(user.username);
          this.form.controls.email.setValue(user.email);
          this.form.controls.createdAt.setValue(user.createdAt ? new Date(user.createdAt).toLocaleDateString() : null);
          this.form.controls.currentPackage.setValue(user.package ?? Package.Free);
          this.form.controls.paymentEndDate.setValue(
            user.paymentEndDate ? new Date(user.paymentEndDate).toLocaleDateString() : null
          );
          this.form.controls.isTrail.setValue(user.isTrail ?? false);
          this.form.controls.trailEndDate.setValue(
            user.trailEnds ? new Date(user.trailEnds).toLocaleDateString() : null
          );

          this.initialForm = this.form.getRawValue();
        } else {
          this.userLogged = false;
        }
      });
    }
  }

  get hasSomeChanges(): boolean {
    if (!this.form.dirty) {
      return false;
    }
    return JSON.stringify(this.initialForm) !== JSON.stringify(this.form?.getRawValue());
  }

  showAvailablePackages(): void {
    this.modalService.createModal(PackagesComponent, 'Pakiety', 900, {
      userId: this.loginService.user.id,
      edit: true,
      selectedPackage: this.form.controls.currentPackage.value,
    });
  }

  deleteAccount(): void {
    const modal = this.modalService.confirmationModal(
      'Usun konto',
      'Czy na pewno chcesz usunac konto?',
      'Usun',
      true,
      () => {
        modal.updateConfig({ nzOkLoading: true });
        this.authenticationService.deleteUser(this.loginService.user.id).subscribe(
          () => {
            modal.updateConfig({ nzOkLoading: false });
            this.loginService.signOut();
            this.router.navigate(['sign']);
          },
          () => {
            modal.updateConfig({ nzOkLoading: false });
          }
        );
      }
    );
  }
}
