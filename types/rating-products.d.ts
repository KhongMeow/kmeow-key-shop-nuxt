import type { Product } from "./products";
import type { User } from "./users";

export interface RatingProduct {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  product: Product;
}