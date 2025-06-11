import type { Product } from "./products";

export interface OrderItem {
  id: number;
  productSlug: string;
  quntity: number;
  product?: Product;
}