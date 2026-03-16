import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItemResponse } from 'src/app/shared/model/cart.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() item!: CartItemResponse;
  @Output() increment = new EventEmitter<string>();
  @Output() decrement = new EventEmitter<string>();
  @Output() remove    = new EventEmitter<string>();

  onIncrement(): void { this.increment.emit(this.item.productCode); }
  onDecrement(): void { this.decrement.emit(this.item.productCode); }
  onRemove():    void { this.remove.emit(this.item.productCode); }
}
