import type { Product } from "../types/Product";
import { api } from "./api";

export async function getProducts() {
  const response = await api.get<Product>('/products/get');

  return response.data.products;
}