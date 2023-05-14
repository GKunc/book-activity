import { Pipe, PipeTransform } from '@angular/core';
import { PaymentPeriod } from '../consts/pay-options.consts';

@Pipe({
  name: 'paymentPeriod',
})
export class PaymentPeriodPipe implements PipeTransform {
  transform(value: PaymentPeriod): unknown {
    switch (value) {
      case PaymentPeriod.Everytime:
        return 'Za zajęcia';
      case PaymentPeriod.Monthly:
        return 'Miesięcznie';
      case PaymentPeriod.Semesterly:
        return 'Semestralnie';
      default:
        return '';
    }
  }
}
