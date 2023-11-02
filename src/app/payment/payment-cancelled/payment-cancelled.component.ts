import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-payment-cancelled',
  templateUrl: 'payment-cancelled.component.html',
  standalone: true,
  imports: [SharedModule],
})
export class PaymentCancelledComponent {
  constructor(private router: Router) {}

  payAgain(): void {
    this.router.navigate(['packages']);
  }
}
