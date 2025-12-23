export type ProductCart = {
  productId: number;
  name: string;
  price: number;
  amount: number;
  image: string | undefined;
};

export type CartContextType = {
  cart: ProductCart[];
  addToCart: (item: ProductCart) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, amount: number) => void;
  clearCart: () => void;
  total: number;
};
