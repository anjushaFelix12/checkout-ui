import { ActiveOffer } from './product.model';

export type CartStatus = 'OPEN' | 'CHECKED_OUT' | 'ABANDONED';

export interface CartItemResponse {
  productCode: string;
  productName: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  activeOffer?: ActiveOffer | null;   // optional — included if backend returns it
}

export interface CartResponse {
  id: string;
  status: CartStatus;
  items: CartItemResponse[];
  itemCount: number;
  totalItems: number;
  subtotal: number;
}

export interface AddItemRequest {
  productCode: string;
  quantity: number;
}

export interface UpdateItemRequest {
  quantity: number;
}
