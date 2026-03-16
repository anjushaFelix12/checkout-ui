import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CheckoutSummary } from 'src/app/shared/model/checkout.model';

@Injectable({ providedIn: 'root' })
export class CheckoutService {

  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  checkout(cartId: string): Observable<CheckoutSummary> {
    return this.http.get<CheckoutSummary>(`${this.baseUrl}/carts/${cartId}/checkout`, {});
  }
}
