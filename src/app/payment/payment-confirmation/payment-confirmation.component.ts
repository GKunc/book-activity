import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/common/services/login-service/login.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: 'payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.less'],
  standalone: true,
  imports: [SharedModule],
})
export class PaymentConfirmationComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.signOut();
  }
}
