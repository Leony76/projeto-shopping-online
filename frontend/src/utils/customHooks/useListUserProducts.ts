import { api } from "../../services/api";
import type { TransactionAPI } from "../../types/TransactionAPI";
import type { ProductAPI } from "../../types/ProductAPI";
import { useCatchError } from "../ui/useCatchError";

type UseListUserProducts = {
  actions: {
    setProduct: React.Dispatch<React.SetStateAction<ProductAPI[]>>;
    setProductTransactions: React.Dispatch<React.SetStateAction<TransactionAPI[]>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }
}

export const useListUserProducts = ({actions}:UseListUserProducts) => {
  const catchError = useCatchError();

  const ListUserProducts = async() => {
    try {
      const response = await api.get('/user-products');
      console.log(response.data);

      actions.setProduct(response.data.products);
      actions.setProductTransactions(response.data.transactions);
    } catch (err:any) {
      catchError(err);
    } finally {
      actions.setIsLoading(false);
    }
  }

  return { ListUserProducts }
}

export default useListUserProducts