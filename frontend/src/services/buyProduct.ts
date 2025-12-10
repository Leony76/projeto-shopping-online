import { api } from "./api";

type PropsType = {
  id: number;
  productAmountInput: number;
}

export async function buyProduct({id, productAmountInput}:PropsType) {
  return await api.post('/products/buy', {
    product_id: id,
    product_amount_bought: productAmountInput
  });
}