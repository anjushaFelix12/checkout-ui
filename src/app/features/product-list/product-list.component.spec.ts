import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { SharedModule } from '../../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/shared/model/product.model';
import { CartResponse } from 'src/app/shared/model/cart.model';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', code: 'APPLE', name: 'Apple', unit: 'piece', unitPrice: 0.30,
    activeOffer: { quantity: 2, bundlePrice: 0.45, description: '2 for €0.45' } },
  { id: '2', code: 'MILK', name: 'Milk', unit: 'liter', unitPrice: 1.20, activeOffer: null }
];

const MOCK_CART: CartResponse = {
  id: 'cart-123', status: 'OPEN', items: [], itemCount: 0, totalItems: 0, subtotal: 0
};

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getAll']);
    cartServiceSpy    = jasmine.createSpyObj('CartService', ['addItem']);
    snackBarSpy       = jasmine.createSpyObj('MatSnackBar', ['open']);

    productServiceSpy.getAll.and.returnValue(of(MOCK_PRODUCTS));
    cartServiceSpy.addItem.and.returnValue(of(MOCK_CART));

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent, ProductCardComponent],
      imports: [
        NoopAnimationsModule,
        SharedModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService,    useValue: cartServiceSpy },
        { provide: MatSnackBar,    useValue: snackBarSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(component.products.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should render a product card for each product', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-product-card');
    expect(cards.length).toBe(2);
  });

  it('should show loading spinner while fetching', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should show error state when products fail to load', () => {
    productServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.error).toBeTrue();
  });

  it('should call cartService.addItem when addToCart event fires', () => {
    component.onAddToCart(MOCK_PRODUCTS[0]);
    expect(cartServiceSpy.addItem).toHaveBeenCalledWith('APPLE', 1);
  });

  it('should show success snackbar after adding to cart', () => {
    component.onAddToCart(MOCK_PRODUCTS[0]);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Apple added to cart', '', jasmine.any(Object)
    );
  });
});
