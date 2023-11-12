import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/common/services/login-service/login.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-payment-cancelled',
  templateUrl: 'payment-cancelled.component.html',
  standalone: true,
  imports: [SharedModule],
})
export class PaymentCancelledComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.signOut();
  }
}
