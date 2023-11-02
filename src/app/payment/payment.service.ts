import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PackageOption } from '../packages/packages.component';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createSubscription(packageId: PackageOption): Observable<string> {
    return this.http.post<string>('/api/payment/subscribe', { packageId });
  }
}
