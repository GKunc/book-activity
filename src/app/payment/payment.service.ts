import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createSubscription(priceId: string): Observable<string> {
    return this.http.post<string>('/api/payment/subscribe', { priceId });
  }
}
