import { useState } from "react";
import type { Product } from "../../types/Product";

export const useAddProducts = () => {

  const initialProduct: Product = {
    image: null,
    name: "",
    amount: "",
    category: "",
    datePutToSale: "",
    description: "",
    price: "",
  };

  const [addProduct, setAddProduct] = useState<Product>(initialProduct);

  const updateProduct = <K extends keyof Product>(
    field: K,
    value: Product[K]
  ) => {
    setAddProduct(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetProduct = () => {
    setAddProduct(initialProduct);
  };

  return {
    addProduct,
    updateProduct,
    resetProduct,
  };
};
