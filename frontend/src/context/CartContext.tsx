import { createContext, useContext, useEffect, useState } from "react";
import type { ProductCart, CartContextType } from "../types/ProductCart";
import { useProducts } from "./ProductContext";
import { useAuth } from "./AuthContext";

const CartContext = createContext<CartContextType | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user }= useAuth();

  const [cart, setCart] = useState<ProductCart[]>([]);
  const { products } = useProducts();
  const cartKey = user ? `cart_user_${user.id}` : 'cart_guest';

  useEffect(() => {
    if (!user) return;

    const saved = localStorage.getItem(`cart_user_${user.id}`);
    if (saved) {
      setCart(JSON.parse(saved));
    } else {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    if (!products.length || cart.length === 0) return;

    setCart(prev =>
      prev
        .map(item => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;

          const newAmount = Math.min(item.amount, product.amount);
          if (newAmount <= 0) return null;

          return {
            ...item,
            price: product.price,
            stock: product.amount,
            amount: newAmount,
          };
        })
        .filter(Boolean) as ProductCart[]
    );
  }, [products]);

  useEffect(() => {
    if (!user) return;

    if (cart.length === 0) {
      localStorage.removeItem(`cart_user_${user.id}`);
    } else {
      localStorage.setItem(`cart_user_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);


  function addToCart(productId: number, requestedAmount: number) {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const safeAmount = Math.min(requestedAmount, product.amount);

    setCart(prev => {
      const exists = prev.find(p => p.productId === productId);

      if (exists) {
        return prev.map(p =>
          p.productId === productId
            ? {
                ...p,
                amount: Math.min(
                  p.amount + safeAmount,
                  product.amount
                ),
                stock: product.amount,
                price: product.price,
                name: product.name,
                image: product.image_url,
              }
            : p
        );
      }

      return [
        ...prev,
        {
          productId,
          name: product.name,
          price: product.price,
          image: product.image_url,
          amount: safeAmount,
          stock: product.amount,
        },
      ];
    });
  }


  function removeFromCart(productId: number) {
    setCart(prev => prev.filter(item => item.productId !== productId));
  }

  function updateQuantity(productId: number, amount: number) {
    if (amount < 1) return;

    const product = products.find(p => p.id === productId);

    if (!product) return;

    setCart(prev =>
      prev.map(item =>
        item.productId === productId 
          ? {...item, amount: Math.min(amount, product.amount)}
          : item
      )
    );
  }


  function clearCart() {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_user_${user.id}`);
    }
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

