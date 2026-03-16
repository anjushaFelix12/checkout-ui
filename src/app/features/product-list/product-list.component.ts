import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/model/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products: Product[] = [];
  loading = true;
  error = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: products => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  onAddToCart(product: Product): void {
    this.cartService.addItem(product.code, 1).subscribe({
      next: () => {
        this.snackBar.open(`${product.name} added to cart`, '', {
          duration: 2000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }
}
