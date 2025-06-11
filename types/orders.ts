import type { OrderItem } from "./order-items";

export interface Order {
  id: number;
  email: string;
  orders: OrderItem[];
  status: 'Order Created' | 'Waiting Payment' | 'Paid' | 'Delivered' | 'Cancelled';
  createAt: Date;
  paidAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}