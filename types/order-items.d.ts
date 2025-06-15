import type { Product } from "./products";

export interface OrderItem {
  id: number;
  productSlug: string;
  quantity: number;
  product?: Product;
}