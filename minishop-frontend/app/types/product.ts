import type { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
}
