import { createContext, useContext, useState } from "react";
import type { ProductAPI } from "../types/ProductAPI";

type ProductsContext = {
  products: ProductAPI[];
  setProducts: React.Dispatch<React.SetStateAction<ProductAPI[]>>;
};

const ProductsContext = createContext<ProductsContext | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductAPI[]>([]);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  }

  return context;
}

