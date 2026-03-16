export interface CheckoutDiscount {
  productCode: string;
  description: string;
  amount: number;
}

export interface CheckoutLineItem {
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;  // renamed from subtotal to match API response
}

export interface CheckoutSummary {
  cartId: string;
  currency: string;
  items: CheckoutLineItem[];
  subtotal: number;
  discounts: CheckoutDiscount[];
  totalDiscount: number;
  total: number;
}
