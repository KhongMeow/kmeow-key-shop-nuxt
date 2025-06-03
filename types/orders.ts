import type { OrderItem } from "./order-items";

export interface Order {
  id: number;
  email: string;
  orders: OrderItem[];
}