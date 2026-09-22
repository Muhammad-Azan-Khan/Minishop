export interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    imageUrl: string | null;
  };
}

export interface Cart {
  id: number;
  items: CartItem[];
}
