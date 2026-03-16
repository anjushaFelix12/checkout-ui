import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { CartResponse } from 'src/app/shared/model/cart.model';

const MOCK_CART: CartResponse = {
  id: 'cart-123',
  status: 'OPEN',
  items: [],
  itemCount: 0,
  totalItems: 0,
  subtotal: 0
};

const MOCK_CART_WITH_ITEM: CartResponse = {
  id: 'cart-123',
  status: 'OPEN',
  items: [{
    productCode: 'APPLE',
    productName: 'Apple',
    unit: 'piece',
    unitPrice: 0.30,
    quantity: 2,
    lineTotal: 0.60
  }],
  itemCount: 1,
  totalItems: 2,
  subtotal: 0.60
};

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // init
  describe('init()', () => {
    it('should create a new cart when no cartId in localStorage', () => {
      service.init().subscribe(cart => {
        expect(cart.id).toBe('cart-123');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/carts');
      expect(req.request.method).toBe('POST');
      req.flush(MOCK_CART);

      expect(localStorage.getItem('supermarket_cart_id')).toBe('cart-123');
    });

    it('should restore existing cart from server when cartId exists in localStorage', () => {
      localStorage.setItem('supermarket_cart_id', 'cart-123');

      service.init().subscribe(cart => {
        expect(cart.id).toBe('cart-123');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/carts/cart-123');
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_CART);
    });
  });

  // createCart
  describe('createCart()', () => {
    it('should POST to /carts and store cartId in localStorage', () => {
      service.createCart().subscribe(cart => {
        expect(cart.id).toBe('cart-123');
        expect(cart.status).toBe('OPEN');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/carts');
      expect(req.request.method).toBe('POST');
      req.flush(MOCK_CART);

      expect(localStorage.getItem('supermarket_cart_id')).toBe('cart-123');
    });

    it('should update cart$ BehaviorSubject after creation', () => {
      service.createCart().subscribe();
      httpMock.expectOne('http://localhost:8080/api/v1/carts').flush(MOCK_CART);

      expect(service.cartSubject.value?.id).toBe('cart-123');
    });
  });

  // addItem 
  describe('addItem()', () => {
    it('should POST to /carts/{id}/items with correct body', () => {
      localStorage.setItem('supermarket_cart_id', 'cart-123');

      service.addItem('APPLE', 1).subscribe(cart => {
        expect(cart.items.length).toBe(1);
        expect(cart.items[0].productCode).toBe('APPLE');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/carts/cart-123/items');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ productCode: 'APPLE', quantity: 1 });
      req.flush(MOCK_CART_WITH_ITEM);
    });

    it('should update itemCount$ after adding item', () => {
      localStorage.setItem('supermarket_cart_id', 'cart-123');
      service.addItem('APPLE', 1).subscribe();
      httpMock.expectOne('http://localhost:8080/api/v1/carts/cart-123/items').flush(MOCK_CART_WITH_ITEM);

      expect(service.itemCount$.value).toBe(1);
    });
  });

  // updateQuantity 
  describe('updateQuantity()', () => {
    it('should PATCH to /carts/{id}/items/{productCode} with new quantity', () => {
      localStorage.setItem('supermarket_cart_id', 'cart-123');

      service.updateQuantity('APPLE', 3).subscribe();

      const req = httpMock.expectOne('http://localhost:8080/api/v1/carts/cart-123/items/APPLE');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ quantity: 3 });
      req.flush(MOCK_CART_WITH_ITEM);
    });
  });

  //  removeItem
  describe('removeItem()', () => {
    it('should DELETE /carts/{id}/items/{productCode}', () => {
      localStorage.setItem('supermarket_cart_id', 'cart-123');

      service.removeItem('APPLE').subscribe();

      const req = httpMock.expectOne('http://localhost:8080/api/v1/carts/cart-123/items/APPLE');
      expect(req.request.method).toBe('DELETE');
      req.flush(MOCK_CART);
    });
  });
});
