import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: 'payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.less'],
  standalone: true,
  imports: [SharedModule],
})
export class PaymentConfirmationComponent {}
