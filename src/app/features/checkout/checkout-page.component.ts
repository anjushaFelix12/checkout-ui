import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartResponse } from 'src/app/shared/model/cart.model';
import { CheckoutService } from 'src/app/core/services/checkout.service';
import { CheckoutSummary, CheckoutDiscount } from 'src/app/shared/model/checkout.model';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {

  cart: CartResponse | null = null;
  summary: CheckoutSummary | null = null;
  loading = false;
  confirmed = false;
  error: string | null = null;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cart = this.cartService.cartSubject.value;
    if (!this.cart || this.cart.items.length === 0) {
      this.router.navigate(['/']);
    }
  }

  getDiscount(productCode: string): CheckoutDiscount | null {
    if (!this.summary) return null;
    return this.summary.discounts.find(d => d.productCode === productCode) ?? null;
  }

  hasDiscount(productCode: string): boolean {
    return !!this.getDiscount(productCode);
  }

  getItemName(productCode: string): string {
    if (!this.summary) return productCode;
    return this.summary.items.find(i => i.productCode === productCode)?.productName ?? productCode;
  }

  // Used in template: cart.items.some(hasActiveOffer)
  hasActiveOffer(item: any): boolean {
    return !!item.activeOffer;
  }

  onConfirmCheckout(): void {
    const cartId = this.cartService.getCartId();
    if (!cartId) return;

    this.loading = true;
    this.error = null;

    this.checkoutService.checkout(cartId).subscribe({
      next: summary => {
        this.summary = summary;
        this.confirmed = true;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Checkout failed. Please try again.';
      }
    });
  }

  onContinueShopping(): void {
    this.router.navigate(['/']);
  }

  onBackToCart(): void {
    this.router.navigate(['/']);
  }
}
