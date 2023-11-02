import { Component } from '@angular/core';
import { tap } from 'rxjs';
import { PaymentService } from '../payment/payment.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.less'],
})
export class PackagesComponent {
  isLoading: boolean = false;
  selectedPackage: PackageOption = PackageOption.Standard;
  availablePackages: typeof PackageOption = PackageOption;

  constructor(private paymentService: PaymentService) {}

  navigateToPayment(): void {
    this.paymentService
      .createSubscription(this.selectedPackage)
      .pipe(tap(() => (this.isLoading = true)))
      .subscribe((data) => {
        this.isLoading = false;
        window.location.href = data;
      });
  }
}

export enum PackageOption {
  Free,
  Starter,
  Standard,
  Premium,
}
