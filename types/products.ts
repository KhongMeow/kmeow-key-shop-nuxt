import type { Category } from "./categories";

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: Category;
  detail: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}