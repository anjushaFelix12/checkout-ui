import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from 'src/app/shared/model/product.model';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    code: 'APPLE',
    name: 'Apple',
    unit: 'piece',
    unitPrice: 0.30,
    activeOffer: {
      quantity: 2,
      bundlePrice: 0.45,
      description: '2 for €0.45'
    }
  },
  {
    id: '2',
    code: 'MILK',
    name: 'Milk',
    unit: 'liter',
    unitPrice: 1.20,
    activeOffer: null
  }
];

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET /products and return product list', () => {
    service.getAll().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products[0].code).toBe('APPLE');
      expect(products[1].activeOffer).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/products');
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_PRODUCTS);
  });

  it('should return products with embedded activeOffer', () => {
    service.getAll().subscribe(products => {
      const apple = products.find(p => p.code === 'APPLE');
      expect(apple?.activeOffer).toBeTruthy();
      expect(apple?.activeOffer?.description).toBe('2 for €0.45');
    });

    httpMock.expectOne('http://localhost:8080/api/v1/products').flush(MOCK_PRODUCTS);
  });
});
