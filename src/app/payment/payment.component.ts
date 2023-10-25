import { Component, OnInit } from '@angular/core';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.component.html',
  styleUrls: ['./payment.component.less'],
  standalone: true,
})
export class PaymentComponent implements OnInit {
  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.createSubscription('price_1NP41gDtchbgKw9RMFIE58uF').subscribe((data) => {
      window.location.href = data;
    });
  }
}
