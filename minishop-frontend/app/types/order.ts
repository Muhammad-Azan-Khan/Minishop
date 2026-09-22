import type { User } from "./user";
import type { Product } from "./product";

export interface OrderItem {
  id: number;
  product: Product | null;
  quantity: number;
  priceAtPurchase: string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  totalAmount: string;
  status: OrderStatus;
  createdAt: string;
}
