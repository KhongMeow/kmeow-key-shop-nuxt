import type { Product } from "./products";

export interface LicenseKey {
  id: string;
  key: string;
  status: 'Active' | 'Ordered' | 'Sold';
  product: Product;
}