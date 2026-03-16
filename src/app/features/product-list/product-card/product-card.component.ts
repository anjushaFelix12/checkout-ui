import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../shared/model/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  onAdd(): void {
    this.addToCart.emit(this.product);
  }

  getImage(code: string): string {
    return `assets/products/${code.toLocaleLowerCase()}.png`;
  }
}
