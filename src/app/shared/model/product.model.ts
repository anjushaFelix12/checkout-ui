export interface ActiveOffer {
  quantity: number;
  bundlePrice: number;
  description: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  unit: string;
  unitPrice: number;
  activeOffer: ActiveOffer | null;
}
