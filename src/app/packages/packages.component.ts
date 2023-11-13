import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { LoginService } from '../common/services/login-service/login.service';
import { PaymentService } from '../payment/payment.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.less'],
})
export class PackagesComponent implements OnInit {
  @Input()
  userId: string;

  @Input()
  edit: boolean = false;

  @Input()
  selectedPackage: PackageOption = PackageOption.Standard;

  isLoading: boolean = false;
  availablePackages: typeof PackageOption = PackageOption;

  constructor(
    private paymentService: PaymentService,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.userId) {
      this.userId = this.route.snapshot.paramMap.get('userId');
    }
  }

  navigateToPayment(): void {
    this.isLoading = true;
    this.paymentService.createSubscription(this.selectedPackage, this.userId).subscribe((data) => {
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
