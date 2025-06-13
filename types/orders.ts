import type { OrderItem } from "./order-items";

export interface Order {
  id: number;
  email: string;
  orderItems: OrderItem[];
  status: 'Order Created' | 'Waiting Payment' | 'Paid' | 'Delivered' | 'Cancelled' | 'Failed to Deliver';
  createdAt: Date;
  paidAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}