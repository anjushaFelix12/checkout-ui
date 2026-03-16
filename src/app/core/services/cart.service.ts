import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartResponse } from '../../shared/model/cart.model';

const CART_ID_KEY = 'supermarket_cart_id';

@Injectable({ providedIn: 'root' })
export class CartService {

  private readonly baseUrl = environment.apiBaseUrl;

  readonly cartSubject = new BehaviorSubject<CartResponse | null>(null);
  cart$ = this.cartSubject.asObservable();

  readonly itemCount$ = new BehaviorSubject<number>(0);
  readonly subtotal$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  // Called once on app init 
  init(): Observable<CartResponse> {
    const existingId = localStorage.getItem(CART_ID_KEY);

    if (existingId) {
      // Restore existing cart from server
      return this.http.get<CartResponse>(`${this.baseUrl}/carts/${existingId}`).pipe(
        tap(cart => this.updateState(cart))
      );
    }

    // No cart yet — create a new one
    return this.createCart();
  }

  createCart(): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.baseUrl}/carts`, {}).pipe(
      tap(cart => {
        localStorage.setItem(CART_ID_KEY, cart.id);
        this.updateState(cart);
      })
    );
  }

  getCart(): Observable<CartResponse> {
    const cartId = this.getCartId();
    return this.http.get<CartResponse>(`${this.baseUrl}/carts/${cartId}`).pipe(
      tap(cart => this.updateState(cart))
    );
  }

  addItem(productCode: string, quantity: number = 1): Observable<CartResponse> {
    const cartId = this.getCartId();
    return this.http
      .post<CartResponse>(`${this.baseUrl}/carts/${cartId}/items`, { productCode, quantity })
      .pipe(tap(cart => this.updateState(cart)));
  }

  updateQuantity(productCode: string, quantity: number): Observable<CartResponse> {
    const cartId = this.getCartId();
    return this.http
      .patch<CartResponse>(`${this.baseUrl}/carts/${cartId}/items/${productCode}`, { quantity })
      .pipe(tap(cart => this.updateState(cart)));
  }

  removeItem(productCode: string): Observable<CartResponse> {
    const cartId = this.getCartId();
    return this.http
      .delete<void>(`${this.baseUrl}/carts/${cartId}/items/${productCode}`)
      .pipe(
        switchMap(() => this.getCart())  // ← fetch updated cart after delete
      );
  }

  clearCart(): Observable<CartResponse> {
    const cartId = this.getCartId();
    return this.http
      .delete<CartResponse>(`${this.baseUrl}/carts/${cartId}/items`)
      .pipe(tap(cart => this.updateState(cart)));
  }

  getCartId(): string {
    return localStorage.getItem(CART_ID_KEY) ?? '';
  }

  resetCart(): void {
    localStorage.removeItem(CART_ID_KEY);
    this.cartSubject.next(null);
    this.itemCount$.next(0);
    this.subtotal$.next(0);
  }

  private updateState(cart: CartResponse): void {
    this.cartSubject.next(cart);
    this.itemCount$.next(cart.itemCount ?? 0);
    this.subtotal$.next(cart.subtotal ?? 0);
  }
}
