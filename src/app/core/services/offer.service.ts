import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Offer } from '../../shared/model/offer.model';

@Injectable({ providedIn: 'root' })
export class OfferService {

  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getActiveOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.baseUrl}/offers`);
  }
}
