import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PackageOption } from '../packages/packages.component';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createSubscription(packageId: PackageOption, userId: string): Observable<string> {
    return this.http.post<string>('/api/payment/subscription', { packageId, userId });
  }

  editSubscription(packageId: PackageOption, userId: string): Observable<string> {
    return this.http.put<string>('/api/payment/subscription', { packageId, userId });
  }
}
