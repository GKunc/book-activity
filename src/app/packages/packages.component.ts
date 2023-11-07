import { Component, Input } from '@angular/core';
import { tap } from 'rxjs';
import { LoginService } from '../common/services/login-service/login.service';
import { PaymentService } from '../payment/payment.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.less'],
})
export class PackagesComponent {
  @Input()
  edit: boolean = false;

  @Input()
  selectedPackage: PackageOption = PackageOption.Standard;

  isLoading: boolean = false;
  availablePackages: typeof PackageOption = PackageOption;

  constructor(private paymentService: PaymentService, private loginService: LoginService) {}

  navigateToPayment(): void {
    this.paymentService
      .createSubscription(this.selectedPackage, this.loginService.loggedUser.id)
      .pipe(tap(() => (this.isLoading = true)))
      .subscribe((data) => {
        this.isLoading = false;
        window.location.href = data;
      });
  }

  navigateToEditPayment(): void {
    this.paymentService
      .editSubscription(this.selectedPackage, this.loginService.loggedUser.id)
      .pipe(tap(() => (this.isLoading = true)))
      .subscribe((data) => {
        this.isLoading = false;
        window.location.href = data;
      });
  }

  selectPackage(selectedPackage: PackageOption): void {
    if (this.edit) {
      return;
    }
    this.selectedPackage = selectedPackage;
  }
}

export enum PackageOption {
  Free = 'Free',
  Starter = 'Starter',
  Standard = 'Standard',
  Premium = 'Premium',
}
