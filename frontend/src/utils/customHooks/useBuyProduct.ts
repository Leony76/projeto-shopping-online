import { useToast } from "../../context/ToastContext";
import { api } from "../../services/api";
import type { ProductAPI } from "../../types/ProductAPI";
import type { UIFlags } from "../../types/UIFlags";
import type { User } from "../../types/User";
import { useCatchError } from "../ui/useCatchError";

type useBuyProduct = {
  actions: {
    setFlags: React.Dispatch<React.SetStateAction<UIFlags>>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setProducts: React.Dispatch<React.SetStateAction<ProductAPI[]>>;
    setSelectedProduct: React.Dispatch<React.SetStateAction<ProductAPI | null>>;
  }
}

export const useBuyProduct = ({actions}:useBuyProduct) => {
  const { showToast } = useToast();
  const catchError = useCatchError();

  const BuyProduct = async(
    processingState: boolean, 
    selectedProduct: ProductAPI | null,

  ) => {
    if (processingState) return; 
    actions.setFlags(prev => ({...prev, processingState: true}));

    if (!selectedProduct)return;

    try {

      const response = await api.post('/buy-product', {
        id: selectedProduct.id,
        amount: selectedProduct.selectedAmount ?? 1, 
      });

      actions.setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          wallet: response.data.wallet,
        }
      });

      const boughtProduct = response.data.product_bought; 

      actions.setProducts(prev =>
        prev.map((p) => 
          p.id === boughtProduct.id ? {
            ...p, 
              amount: boughtProduct.amount,
              orders_sum_quantity: boughtProduct.orders_sum_quantity,
          } : p,
        )
      );

      actions.setSelectedProduct(prev =>
        prev && prev.id === boughtProduct.id
          ? {
              ...prev,
              amount: boughtProduct.amount,
              orders_sum_quantity: boughtProduct.orders_sum_quantity,
            }
          : prev
      );

      showToast(response.data.message, response.data.type);
    } catch (err) {
      catchError(err);
    } finally {
      actions.setFlags(prev => ({...prev,
        showProductInfo: false,
        showProductAmount: false,
        showConfirmPurchase: false,
        processingState: false,
      }))
    }
  }

  return { BuyProduct }
}

