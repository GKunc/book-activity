import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-payment-cancelled',
  templateUrl: 'payment-cancelled.component.html',
  standalone: true,
  imports: [SharedModule],
})
export class PaymentCancelledComponent {}
