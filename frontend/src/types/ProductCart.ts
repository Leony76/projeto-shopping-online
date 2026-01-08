export type ProductCart = {
  productId: number;
  amount: number;
  price: number;
  name: string;
  image: string | undefined;
  stock: number;
};

export type CartContextType = {
  cart: ProductCart[];
  addToCart: (productId: number, amount: number, price: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, amount: number) => void;
  clearCart: () => void;
  total: number;
};

