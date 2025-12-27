import { useToast } from "../../context/ToastContext";
import { getCsrf, api } from "../../services/api";
import type { ProductAPI } from "../../types/ProductAPI";
import type { UIFlags } from "../../types/UIFlags";
import { useCatchError } from "../ui/useCatchError";

type useRemoveProduct = {
  actions: {
    setFlags: React.Dispatch<React.SetStateAction<UIFlags>>;
    setProducts: React.Dispatch<React.SetStateAction<ProductAPI[]>>;
  }
}

export const useRemoveProduct = ({actions}:useRemoveProduct) => {
  const { showToast } = useToast(); 
  const catchError = useCatchError();

  const RemoveProduct = async(id:number, processingState: boolean) => {
    if (processingState) return;
    actions.setFlags(prev => ({...prev, processingState: true}))

    try {
      await getCsrf();
      const response = await api.delete(`/product/${id}`);

      actions.setProducts(prev => prev.filter((p) => p.id !== id));

      showToast(response.data.message, response.data.type);
      actions.setFlags(prev => ({...prev, processingState: false}));
    } catch (err:any) {
      catchError(err);
    }
  }

  return { RemoveProduct };
}