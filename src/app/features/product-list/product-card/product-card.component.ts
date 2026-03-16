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

  getEmoji(code: string): string {
    const map: Record<string, string> = {
      APPLE: '🍎', BANANA: '🍌', MILK: '🥛', BREAD: '🍞',
      ORANGE: '🍊', BUTTER: '🧈', CHEESE: '🧀', EGG: '🥚',
      TOMATO: '🍅', CARROT: '🥕', POTATO: '🥔', CHICKEN: '🍗'
    };
    return map[code] ?? '🛒';
  }

  getImage(code: string): string {
    return `assets/products/${code.toLocaleLowerCase()}.png`;
  }
}
