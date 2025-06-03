import type { Product } from "./products";

export interface LicenseKey {
  id: string;
  key: string;
  status: 'Active' | 'Waiting Payment' | 'Cancelled' | 'Paid' | 'Delivered';
  product: Product;
}