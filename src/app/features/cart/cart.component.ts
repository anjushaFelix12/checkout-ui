import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';
import { CartResponse } from 'src/app/shared/model/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  
  @Output() close = new EventEmitter<void>();

  cart$: Observable<CartResponse | null>;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {}

  onIncrement(productCode: string): void {
    const cart = this.cartService.cartSubject.value;
    if (!cart) return;
    const item = cart.items.find(i => i.productCode === productCode);
    if (!item) return;
    this.cartService.updateQuantity(productCode, item.quantity + 1).subscribe();
  }

  onDecrement(productCode: string): void {
    const cart = this.cartService.cartSubject.value;
    if (!cart) return;
    const item = cart.items.find(i => i.productCode === productCode);
    if (!item || item.quantity <= 1) return;
    this.cartService.updateQuantity(productCode, item.quantity - 1).subscribe();
  }

  onRemove(productCode: string): void {
    this.cartService.removeItem(productCode).subscribe();
  }

  onCheckout(): void {
    this.close.emit();                   
    this.router.navigate(['/checkout']);
  }

  onClose(): void {
    this.close.emit();
  }
}
