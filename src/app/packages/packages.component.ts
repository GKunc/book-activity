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

  isLoading: boolean = false;
  selectedPackage: PackageOption = PackageOption.Standard;
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
}

export enum PackageOption {
  Free = 'Free',
  Starter = 'Starter',
  Standard = 'Standard',
  Premium = 'Premium',
}
