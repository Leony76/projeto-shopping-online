import { createContext, useContext, useEffect, useState } from "react";
import type { ProductCart, CartContextType } from "../types/ProductCart";
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ProductCart[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item: ProductCart) {
    setCart(prev => {
      const exists = prev.find(p => p.productId === item.productId);

      if (exists) {
        return prev.map(p =>
          p.productId === item.productId
            ? { ...p, amount: p.amount + item.amount }
            : p
        );
      }
      
      return [...prev, item];
    });
  }

  function removeFromCart(productId: number) {
    setCart(prev => prev.filter(item => item.productId !== productId));
  }

  function updateQuantity(productId: number, amount: number) {
    if (amount < 1) return;

    setCart(prev =>
      prev.map(item =>
        item.productId === productId 
          ? {...item, amount: Math.min(amount, item.stock)}
          : item
      )
    );
  }


  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.amount,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }

  return context;
}

