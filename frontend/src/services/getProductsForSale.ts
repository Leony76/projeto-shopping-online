import { api } from "./api";

export async function getProductsForSale() {
  const response = await api.get('/products');

  return response.data;
}