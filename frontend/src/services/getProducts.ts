import { api } from "./api";
import type { ProductAPI } from "../types/ProductAPI";

export const getProducts = async(): Promise<ProductAPI[]> => {
  const response = await api.get<{products: ProductAPI[]}>('/products');
  return response.data.products;
}

